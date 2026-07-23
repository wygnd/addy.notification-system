import { Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import {
  IIdentityMessageSendConnectPayloadFields,
  IIdentityMessageSendConnectResponse,
} from '@modules/identity/interfaces';
import { PlatformEnum } from '@shared/enums';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class IdentityService {
  constructor(private readonly commandBus: CommandBus) {}

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

  public async connectClient(
    data: IIdentityMessageSendConnectPayloadFields,
  ): Promise<IIdentityMessageSendConnectResponse> {
    const { userId, platform } = data;

    switch (platform) {
      case PlatformEnum.VK:
        break;

      default:
        throw new Error('Not allowed');
    }

    // todo занести клиента в БД

    return {
      message: `Клиент подключен к ${platform}`,
    };
  }

  public async handleConnectClient(
    context: RmqContext,
    data: IIdentityMessageSendConnectPayloadFields,
  ) {
    return this.handleSendWithAck(context, () => this.connectClient(data));
  }
}
