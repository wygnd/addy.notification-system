import {
  AppRpcException,
  ErrorCodeEnum,
  normalizeError,
  NotificationLogStatusEnum,
  NotificationResultEnum,
  PlatformEnum,
  VkSendIsClientMemberPayload,
  VkSendMessagePayload,
} from '@addy/common';
import '@modules/vk/interfaces';
import { VkNotificationProvider } from '@modules/vk/providers/provider';
import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { VkGroupService } from './group';
import { VkMessageService } from './message';

@Injectable()
export class VkService {
  private readonly logger = new Logger(VkService.name);

  constructor(
    private readonly vkNotificationProvider: VkNotificationProvider,
    private readonly vkGroupService: VkGroupService,
    private readonly vkMessageService: VkMessageService,
  ) {}

  private async handleEmitWithAck<T>(
    context: RmqContext,
    handler: () => Promise<T>,
  ): Promise<void> {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

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
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    try {
      const response = await handler();
      channel.ack(originalMsg);

      return response;
    } catch (error) {
      channel.nack(originalMsg, false, false);
      throw error;
    }
  }

  /**
   * Отправляет событие обратно продюсеру через отдельную очередь
   * @param correlationId
   * @param status
   * @param errMessage
   */
  public async sendMessageResult(
    correlationId: string,
    status: NotificationLogStatusEnum,
    errMessage?: string,
  ): Promise<void> {
    try {
      await this.vkNotificationProvider.emit(
        NotificationResultEnum.SEND_RESULT,
        {
          correlationId: correlationId,
          channel: PlatformEnum.VK,
          status: status,
          errorMessage: errMessage,
        },
      );
    } catch (error) {
      this.logger.error(normalizeError(error));
    }
  }

  private async handleSendMessage(data: VkSendMessagePayload) {
    const { correlationId, userId, text } = data;
    try {
      const isAllowedSendMessage = await this.vkGroupService.isAllowSendMessage(
        Number(userId),
      );

      if (!isAllowedSendMessage) {
        throw new AppRpcException(
          ErrorCodeEnum.NOT_ALLOWED,
          'User not receive messages from groups',
        );
      }

      await this.sendMessageResult(
        correlationId,
        NotificationLogStatusEnum.PROCESSING,
      );

      await this.vkMessageService.sendMessage(userId, text);

      await this.sendMessageResult(
        correlationId,
        NotificationLogStatusEnum.COMPLETED,
      );
    } catch (error) {
      const { message } = normalizeError(error);

      await this.sendMessageResult(
        correlationId,
        NotificationLogStatusEnum.FAILED,
        message,
      );
    }
  }

  private async checkUserInGroup(data: VkSendIsClientMemberPayload) {
    try {
      const exists = await this.vkGroupService.isMemberUser(
        Number(data.userId),
      );

      return {
        status: exists,
        message: exists
          ? 'Пользователь подписан на сообщество'
          : 'Пользователь не подписан на сообщество',
      };
    } catch (error) {
      this.logger.error(normalizeError(error));
      throw error;
    }
  }

  public async handleSendNotification(
    context: RmqContext,
    data: VkSendMessagePayload,
  ): Promise<void> {
    await this.handleEmitWithAck(context, () => this.handleSendMessage(data));
  }

  public async handleCheckUserInGroup(
    context: RmqContext,
    data: VkSendIsClientMemberPayload,
  ) {
    return this.handleSendWithAck(context, () => this.checkUserInGroup(data));
  }
}
