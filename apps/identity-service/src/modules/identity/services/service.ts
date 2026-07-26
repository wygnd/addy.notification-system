import {
  IIdentityMessageExistsClientPlatformPayload,
  IIdentityMessageExistsClientPlatformResponse,
  normalizeError,
  PlatformEnum,
} from '@addy/common';
import {
  IdentityStatusEnum,
  IIdentityMessageCheckConnectPayload,
  IIdentityMessageCheckConnectResponse,
  IIdentityMessageSendConnectPayloadFields,
  IIdentityMessageSendConnectResponse,
} from '@addy/common';
import { IdentityAddCommand } from '@modules/identity/commands';
import { TIdentityCreationEntity } from '@modules/identity/interfaces';
import { IdentityExistsPlatformQuery } from '@modules/identity/queries/exists/platform/query';
import { IdentityExistsQuery } from '@modules/identity/queries/exists/query';
import { REDIS_KEYS } from '@modules/redis/constants/constants';
import { RedisService } from '@modules/redis/services/service';
import {
  ConflictException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RmqContext } from '@nestjs/microservices';
import { randomInt } from 'node:crypto';

@Injectable()
export class IdentityService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly redisService: RedisService,
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

      default:
        throw new MethodNotAllowedException('Not allowed');
    }

    await this.commandBus.execute(
      new IdentityAddCommand(identityCreationFields),
    );

    if (platform === PlatformEnum.VK) {
      return {
        message: `Client was connected to ${platform}`,
      };
    }

    const code = randomInt(100000, 999999);

    await this.redisService.set(
      REDIS_KEYS.OTP + `${platform}:${userId}`,
      code,
      5 * 60,
    );

    return {
      message: `Waiting client connection until 5 minutes on ${platform}`,
      code: code,
    };
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
}
