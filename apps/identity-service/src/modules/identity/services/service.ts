import {
  AppRpcException,
  ErrorCodeEnum,
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
import { Injectable } from '@nestjs/common';
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

  private async initialTokenConnect(
    userId: string,
    platform: PlatformEnum,
  ): Promise<string> {
    const token = randomBytes(24).toString('base64url');
    const redisKey = REDIS_KEYS.CLIENT_CONNECT_START + `${platform}:${token}`;

    await this.redisService.set(redisKey, token, 600);

    return token;
  }

  private async confirmTokenConnect(
    token: string,
    platform: PlatformEnum,
  ): Promise<string> {
    const redisKey = REDIS_KEYS.CLIENT_CONNECT_START + `${platform}:${token}`;

    const userId = await this.redisService.get<string>(redisKey);

    if (!userId) {
      throw new Error('Код подключения недействителен или истек');
    }

    await this.redisService.del(redisKey);

    return userId;
  }

  private async connectClient(
    data: IIdentityMessageSendConnectPayloadFields,
  ): Promise<IIdentityMessageSendConnectResponse> {
    const { userId, platform } = data;

    const existsRow = await this.queryBus.execute(
      new IdentityExistsQuery(userId, platform),
    );

    if (existsRow && existsRow.status !== IdentityStatusEnum.REVOKED) {
      throw new AppRpcException(ErrorCodeEnum.USER_WAS_CONNECTING_TO_PLATFORM);
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
        throw new AppRpcException(ErrorCodeEnum.NOT_ALLOWED);
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
        throw new AppRpcException(ErrorCodeEnum.INTERNAL_ERROR);
      }

      const code = await this.otpService.create(platform);
      const connectionToken = await this.initialTokenConnect(userId, platform);

      return {
        status: true,
        message: 'Code was generated successfully',
        platform: PlatformEnum.TELEGRAM,
        code: code,
        connectionLink: `https://t.me/${botUsername}?start=${connectionToken}`,
      };
    }

    throw new AppRpcException(ErrorCodeEnum.NOT_ALLOWED);
  }

  private async checkClientConnection(
    data: IIdentityMessageCheckConnectPayload,
  ): Promise<IIdentityMessageCheckConnectResponse> {
    const { userId, platform } = data;

    const client = await this.queryBus.execute(
      new IdentityExistsQuery(userId, platform),
    );

    if (!client) {
      throw new AppRpcException(ErrorCodeEnum.USER_NOT_FOUND);
    }

    if (client.status === IdentityStatusEnum.PENDING) {
      throw new AppRpcException(ErrorCodeEnum.USER_NOT_VERIFIED);
    }

    if (client.status === IdentityStatusEnum.REVOKED) {
      throw new AppRpcException(ErrorCodeEnum.USER_WAS_REVOKED);
    }

    if (!client.platformUserId) {
      throw new AppRpcException(ErrorCodeEnum.USER_NOT_MATCHED);
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
        throw new AppRpcException(ErrorCodeEnum.USER_NOT_FOUND);
      }

      if (client.status === IdentityStatusEnum.PENDING) {
        throw new AppRpcException(ErrorCodeEnum.USER_NOT_VERIFIED);
      }

      if (client.status === IdentityStatusEnum.REVOKED) {
        throw new AppRpcException(ErrorCodeEnum.USER_WAS_REVOKED);
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
      const { message } = normalizeError(error);

      return {
        status: false,
        message: message,
      };
    }
  }

  private async confirmClientConnection(
    data: IIdentityMessageVerifyConnectPayload,
  ) {
    try {
      const { platform, platformUserId, code } = data;

      const userId = await this.confirmTokenConnect(code, platform);

      const existing = await this.queryBus.execute(
        new IdentityExistsQuery(userId, platform),
      );

      if (!existing) {
        throw new Error('Не удалось подключить аккаунт');
      }

      if (existing && existing.status === IdentityStatusEnum.VERIFIED) {
        throw new Error('Этот аккаунт уже привязан к другому пользователю');
      }

      await this.commandBus.execute(
        new IdentityUpdateCommand(existing.id, {
          platformUserId: platformUserId,
          status: IdentityStatusEnum.VERIFIED,
          verifiedAt: new Date().toISOString(),
        }),
      );

      return {
        status: true,
        message:
          'Аккаунт успешно подключен. Теперь, вы будете получать уведомления!',
      };
    } catch (error) {
      const { message } = normalizeError(error);

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

  public async handleConfirmClientConnection(
    context: RmqContext,
    data: IIdentityMessageVerifyConnectPayload,
  ) {
    return this.handleSendWithAck(context, () =>
      this.confirmClientConnection(data),
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
