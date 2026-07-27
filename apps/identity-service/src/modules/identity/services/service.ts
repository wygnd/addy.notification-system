import {
  IdentityStatusEnum,
  IIdentityMessageCheckConnectPayload,
  IIdentityMessageCheckConnectResponse,
  IIdentityMessageDisconnectPayload,
  IIdentityMessageDisconnectResponse,
  IIdentityMessageExistsClientPlatformPayload,
  IIdentityMessageExistsClientPlatformResponse,
  IIdentityMessageSendConnectPayloadFields,
  IIdentityMessageSendConnectResponse,
  IIdentityMessageVerifyConnectPayload,
  normalizeError,
  PlatformEnum,
} from '@addy/common';
import { IdentityAddCommand } from '@modules/identity/commands';
import { IdentityUpdateCommand } from '@modules/identity/commands/update/command';
import { TIdentityCreationEntity } from '@modules/identity/interfaces';
import { IdentityExistsPlatformQuery } from '@modules/identity/queries/exists/platform/query';
import { IdentityExistsQuery } from '@modules/identity/queries/exists/query';
import { OtpService } from '@modules/opt/services/service';
import { REDIS_KEYS } from '@modules/redis/constants/constants';
import { RedisService } from '@modules/redis/services/service';
import {
  ConflictException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RmqContext } from '@nestjs/microservices';
import { randomBytes } from 'node:crypto';

@Injectable()
export class IdentityService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly redisService: RedisService,
    private readonly otpService: OtpService,
    private readonly configService: ConfigService,
  ) {}

  private async handleEmitWithAck<T>(
    context: RmqContext,
    handler: () => Promise<T>,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await handler();
      channel.ack(originalMsg);
    } catch (error) {
      channel.nack(originalMsg, false, false);
      throw error;
    }
  }

  private async handleSendWithAck<T>(
    context: RmqContext,
    handler: () => Promise<T>,
  ): Promise<T> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const response = await handler();
      channel.ack(originalMsg);

      return response;
    } catch (error) {
      channel.nack(originalMsg, false, false);
      throw error;
    }
  }

  private async connectClient(
    data: IIdentityMessageSendConnectPayloadFields,
  ): Promise<IIdentityMessageSendConnectResponse> {
    try {
      const { userId, platform } = data;

      const existsRow = await this.queryBus.execute(
        new IdentityExistsQuery(userId, platform),
      );

      if (existsRow) {
        throw new ConflictException('User already exists');
      }

      let identityCreationFields: TIdentityCreationEntity = {
        platform: platform,
        externalUserId: userId,
        status: IdentityStatusEnum.PENDING,
        platformUserId: null,
        verifiedAt: null,
      };

      switch (platform) {
        case PlatformEnum.VK:
          identityCreationFields.platformUserId = data.platformUserId;
          identityCreationFields.status = IdentityStatusEnum.VERIFIED;
          identityCreationFields.verifiedAt = new Date().toISOString();
          break;

        case PlatformEnum.TELEGRAM:
          break;

        default:
          throw new MethodNotAllowedException('Not allowed');
      }

      await this.commandBus.execute(
        new IdentityAddCommand(identityCreationFields),
      );

      if (platform === PlatformEnum.VK) {
        return {
          status: true,
          platform: PlatformEnum.VK,
          message: `Client was connected to ${platform}`,
        };
      }

      if (platform === PlatformEnum.TELEGRAM) {
        const botUsername = this.configService.get<string>(
          'TELEGRAM_BOT_USERNAME',
        );

        if (!botUsername) {
          return {
            status: false,
            platform: PlatformEnum.TELEGRAM,
            message: 'Internal Server Error',
          };
        }

        const code = await this.otpService.create(platform);

        return {
          status: true,
          platform: PlatformEnum.TELEGRAM,
          message: 'Code was generated successfully',
          code: code,
        };
      }

      return {
        status: false,
        platform: platform,
        message: 'Not allowed',
      };
    } catch (error) {
      const { message } = normalizeError(error);

      return {
        status: false,
        platform: data.platform,
        message: message,
      };
    }
  }

  private async checkClientConnection(
    data: IIdentityMessageCheckConnectPayload,
  ): Promise<IIdentityMessageCheckConnectResponse> {
    const { userId, platform } = data;

    const client = await this.queryBus.execute(
      new IdentityExistsQuery(userId, platform),
    );

    if (!client) {
      throw new NotFoundException('User not found');
    }

    if (client.status === IdentityStatusEnum.PENDING) {
      throw new MethodNotAllowedException('User not verified');
    }

    if (client.status === IdentityStatusEnum.REVOKED) {
      throw new MethodNotAllowedException('User was revoked');
    }

    if (!client.platformUserId) {
      throw new MethodNotAllowedException(
        'User not matched with platform user account',
      );
    }

    return {
      status: true,
      clientId: client.platformUserId,
    };
  }

  private async checkClientPlatformExists(
    data: IIdentityMessageExistsClientPlatformPayload,
  ): Promise<IIdentityMessageExistsClientPlatformResponse> {
    try {
      const { platform, platformUserId } = data;

      const client = await this.queryBus.execute(
        new IdentityExistsPlatformQuery(platformUserId, platform),
      );

      if (!client) {
        throw new Error('User not found');
      }

      if (client.status === IdentityStatusEnum.PENDING) {
        throw new Error('User not verified');
      }

      if (client.status === IdentityStatusEnum.REVOKED) {
        throw new Error('User was revoked');
      }

      return {
        status: true,
        message: 'User successfully found',
      };
    } catch (error) {
      const { message } = normalizeError(error);

      return {
        status: false,
        message: message,
      };
    }
  }

  private async verifyClientConnection(
    data: IIdentityMessageVerifyConnectPayload,
  ) {
    try {
      const { platform, code, platformUserId } = data;

      const userId = await this.otpService.verify(platform, code);

      const [existing, identity] = await Promise.all([
        this.queryBus.execute(
          new IdentityExistsPlatformQuery(platformUserId, platform),
        ),
        this.queryBus.execute(new IdentityExistsQuery(userId, platform)),
      ]);

      if (!identity) {
        throw new Error('User was not found');
      }

      if (existing && existing.status === IdentityStatusEnum.VERIFIED) {
        throw new Error('This account was connected to another user');
      }

      await this.commandBus.execute(
        new IdentityUpdateCommand(identity.id, {
          status: IdentityStatusEnum.VERIFIED,
          verifiedAt: new Date().toISOString(),
          platformUserId: platformUserId,
        }),
      );

      return {
        status: true,
        message: `Аккаунт подключен к ${platform}`,
      };
    } catch (error) {
      const { code, message } = normalizeError(error);

      console.log(code, message);

      return {
        status: false,
        message: message,
      };
    }
  }

  private async disconnectClientFromPlatform(
    data: IIdentityMessageDisconnectPayload,
  ): Promise<IIdentityMessageDisconnectResponse> {
    try {
      const { platform, platformUserId } = data;

      const existing = await this.queryBus.execute(
        new IdentityExistsPlatformQuery(platformUserId, platform),
      );

      if (!existing) {
        throw new Error('Account is not connected');
      }

      await this.commandBus.execute(
        new IdentityUpdateCommand(existing.id, {
          status: IdentityStatusEnum.REVOKED,
          platformUserId: null,
          verifiedAt: null,
        }),
      );

      return {
        status: true,
        message: `Client was successfully disconnected`,
      };
    } catch (error) {
      const { message } = normalizeError(error);

      return {
        status: false,
        message: message,
      };
    }
  }

  /* ========================== PUBLIC HANDLERS ========================== */
  public async handleConnectClient(
    context: RmqContext,
    data: IIdentityMessageSendConnectPayloadFields,
  ) {
    return this.handleSendWithAck(context, () => this.connectClient(data));
  }

  public async handleCheckClientConnection(
    context: RmqContext,
    data: IIdentityMessageCheckConnectPayload,
  ) {
    return this.handleSendWithAck(context, () =>
      this.checkClientConnection(data),
    );
  }

  public async handleCheckClientPlatformExists(
    context: RmqContext,
    data: IIdentityMessageExistsClientPlatformPayload,
  ) {
    return this.handleSendWithAck(context, () =>
      this.checkClientPlatformExists(data),
    );
  }

  public async handleVerifyClientConnection(
    context: RmqContext,
    data: IIdentityMessageVerifyConnectPayload,
  ) {
    return this.handleSendWithAck(context, () =>
      this.verifyClientConnection(data),
    );
  }

  public async handleDisconnectAccount(
    context: RmqContext,
    data: IIdentityMessageDisconnectPayload,
  ) {
    return this.handleSendWithAck(context, () =>
      this.disconnectClientFromPlatform(data),
    );
  }
}
