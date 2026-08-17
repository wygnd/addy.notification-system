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
  IIdentityMessageGetConnectedPlatformsPayload,
  IIdentityMessageGetConnectedPlatformsResponse,
  IIdentityMessageGetUserConnectionItem,
  IIdentityMessageGetUserConnectionPayload,
  IIdentityMessageGetUserConnectionResponse,
  IIdentityMessageSendConnectPayloadFields,
  IIdentityMessageSendConnectResponse,
  IIdentityMessageVerifyConnectPayload,
  normalizeError,
  PlatformEnum,
} from '@addy/common';
import { IdentityAddCommand } from '@modules/identity/commands';
import { IdentityUpdateCommand } from '@modules/identity/commands/update/command';
import { IdentityDTO } from '@modules/identity/dtos';
import { TIdentityCreationEntity } from '@modules/identity/interfaces';
import {
  IdentityGetClientByExternalIDQuery,
  IdentityGetClientByExternalIDsQuery,
} from '@modules/identity/queries/client/[external-id]';
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

  private async formConnectionData(
    data: IIdentityMessageSendConnectPayloadFields,
  ) {
    const { userId, platform } = data;
    let connectionLink: string | undefined = undefined;
    const connectionToken = await this.initialTokenConnect(userId, platform);

    switch (platform) {
      case PlatformEnum.TELEGRAM:
        const botUsername = this.configService.get<string>(
          'TELEGRAM_BOT_USERNAME',
        );

        if (!botUsername) {
          throw new AppRpcException(
            ErrorCodeEnum.INTERNAL_ERROR,
            `На данный момент невозможно подключиться к ${platform}`,
          );
        }

        connectionLink = `https://t.me/${botUsername}?start=${connectionToken}`;

        break;

      case PlatformEnum.VK:
        const groupScreenName = this.configService.get<string>(
          'VK_SCREEN_GROUP_NAME',
        );

        if (!groupScreenName) {
          throw new AppRpcException(
            ErrorCodeEnum.INTERNAL_ERROR,
            `На данный момент невозможно подключиться к ${platform}`,
          );
        }

        connectionLink = `https://vk.me/${groupScreenName}/?ref=${connectionToken}&text=Подключить%20аккаунт`;
        break;

      default:
        throw new AppRpcException(
          ErrorCodeEnum.NOT_ALLOWED,
          'Invalid platform',
        );
    }

    return {
      code: await this.otpService.create(platform, userId),
      connectionLink: connectionLink,
    };
  }

  private async connectClient(
    data: IIdentityMessageSendConnectPayloadFields,
  ): Promise<IIdentityMessageSendConnectResponse> {
    const { userId, platform } = data;

    const rateLimitRedisKey =
      REDIS_KEYS.CLIENT_CONNECT_LIMIT + `${platform}:${userId}`;
    const connectionAttempts = await this.redisService.incr(rateLimitRedisKey);

    await this.redisService.expire(rateLimitRedisKey, 300);

    if (connectionAttempts > 5) {
      throw new AppRpcException(ErrorCodeEnum.TOO_MANY_ATTEMPTS);
    }

    const existsRow = await this.queryBus.execute(
      new IdentityExistsQuery(userId, platform),
    );

    if (existsRow) {
      if (existsRow.status === IdentityStatusEnum.PENDING) {
        throw new AppRpcException(
          ErrorCodeEnum.USER_WAS_CONNECTING_TO_PLATFORM,
          'Пользователь уже отправлял запрос на подключение',
        );
      }

      if (existsRow.status === IdentityStatusEnum.VERIFIED) {
        throw new AppRpcException(
          ErrorCodeEnum.USER_WAS_CONNECTING_TO_PLATFORM,
        );
      }
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
        identityCreationFields['platformUserId'] = data.platformUserId;
        identityCreationFields['status'] = IdentityStatusEnum.VERIFIED;
        identityCreationFields['verifiedAt'] = new Date().toISOString();
        break;

      case PlatformEnum.TELEGRAM:
        break;

      default:
        throw new AppRpcException(ErrorCodeEnum.NOT_ALLOWED);
    }

    let identity = await this.queryBus.execute(
      new IdentityExistsQuery(userId, platform),
    );

    // Если не нашли запись: создаем
    if (!identity) {
      identity = await this.commandBus.execute(
        new IdentityAddCommand(identityCreationFields),
      );
    }
    // Обновляем поля
    else {
      await this.commandBus.execute(
        new IdentityUpdateCommand(identity.id, identityCreationFields),
      );
    }

    await this.redisService.del(rateLimitRedisKey);

    try {
      const { code, connectionLink } = await this.formConnectionData(data);

      return {
        status: true,
        message: 'Code was generated successfully',
        platform: platform,
        code: code,
        connectionLink: connectionLink,
      };
    } catch {
      await this.commandBus.execute(
        new IdentityUpdateCommand(identity.id, {
          status: IdentityStatusEnum.FAILED,
        }),
      );

      throw new AppRpcException(ErrorCodeEnum.SERVICE_INTERNAL_ERROR);
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
        throw new AppRpcException(ErrorCodeEnum.USER_NOT_FOUND);
      }

      if (existing && existing.status === IdentityStatusEnum.VERIFIED) {
        throw new AppRpcException(
          ErrorCodeEnum.USER_WAS_CONNECTING_TO_PLATFORM,
        );
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
        message: 'Аккаунт успешно подключен.',
      };
    } catch (error) {
      const { message } = normalizeError(error);

      console.log(error);

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
        throw new AppRpcException(ErrorCodeEnum.IDENTITY_ACCOUNT_NOT_CONNECTED);
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

  private async getClientConnections(
    data: IIdentityMessageGetUserConnectionPayload,
  ): Promise<IIdentityMessageGetUserConnectionResponse> {
    const { userId } = data;

    const clientPlatformList = await this.queryBus.execute(
      new IdentityGetClientByExternalIDQuery(userId),
    );

    if (clientPlatformList.length === 0) {
      throw new AppRpcException(ErrorCodeEnum.USER_NOT_FOUND);
    }

    const visitedPlatformSet = new Set<string>();
    const items: IIdentityMessageGetUserConnectionItem[] = [];

    for (const platform of Object.values(PlatformEnum)) {
      if (
        visitedPlatformSet.has(platform) ||
        platform === PlatformEnum.UNKNOWN
      ) {
        continue;
      }

      const client = clientPlatformList.find((c) => c.platform === platform);
      let isClientConnected: boolean = false;
      let platformUserId: string | null = null;

      if (client && client.status === IdentityStatusEnum.VERIFIED) {
        isClientConnected = true;
        platformUserId = client.platformUserId;
      }

      items.push({
        platform: platform,
        connected: isClientConnected,
        platformUserId: platformUserId,
      });

      visitedPlatformSet.add(platform);
    }

    return { items };
  }

  private async getConnectedPlatforms(
    data: IIdentityMessageGetConnectedPlatformsPayload,
  ): Promise<IIdentityMessageGetConnectedPlatformsResponse> {
    const { clientIds } = data;

    const result: Record<string, IIdentityMessageGetUserConnectionItem[]> = {};

    const clientList = await this.queryBus.execute(
      new IdentityGetClientByExternalIDsQuery(clientIds),
    );

    for (const {
      externalUserId,
      status,
      platform,
      platformUserId,
    } of clientList) {
      const clientData = externalUserId in result ? result[externalUserId] : [];

      result[externalUserId] = [
        ...clientData,
        {
          platform: platform,
          connected: status === IdentityStatusEnum.VERIFIED,
          platformUserId: platformUserId,
        },
      ];
    }

    return {
      items: result,
    };
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

  public async handleGetClientConnections(
    context: RmqContext,
    data: IIdentityMessageGetUserConnectionPayload,
  ) {
    return this.handleSendWithAck(context, () =>
      this.getClientConnections(data),
    );
  }

  public async handleGetConnectedPlatforms(
    context: RmqContext,
    data: IIdentityMessageGetConnectedPlatformsPayload,
  ) {
    return this.handleSendWithAck(context, () =>
      this.getConnectedPlatforms(data),
    );
  }
}
