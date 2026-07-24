import {
  ConflictException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import {
  IdentityStatusEnum,
  IIdentityMessageCheckConnectPayload,
  IIdentityMessageCheckConnectResponse,
  IIdentityMessageSendConnectPayloadFields,
  IIdentityMessageSendConnectResponse,
  TIdentityCreationEntity,
} from '@modules/identity/interfaces';
import { PlatformEnum } from '@shared/enums';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { IdentityAddCommand } from '@modules/identity/commands';
import { IdentityExistsQuery } from '@modules/identity/queries/exists/query';

@Injectable()
export class IdentityService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
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

    return {
      message: `Клиент подключен к ${platform}`,
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

    if(!client.platformUserId) {
      throw new MethodNotAllowedException('User not matched with platform user account');
    }

    return {
      status: true,
      clientId: client.platformUserId,
    };
  }

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
}
