import { Injectable, Logger } from '@nestjs/common';
import { normalizeError } from '@shared/utils';
import { NotificationPatternEnum, NotificationResultEnum } from '@shared/enums';
import { VkNotificationProvider } from '@modules/vk/providers/provider';
import { PlatformEnum } from '@shared/interfaces';
import { RmqContext } from '@nestjs/microservices';
import {
  VkCheckClientInGroupPayload,
  VkSendMessagePayload,
} from '@modules/vk/interfaces';
import { VkGroupService, VkMessageService } from '@modules/vk/services';

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

  /**
   * Отправляет событие обратно продюсеру через отдельную очередь
   * @param correlationId
   * @param status
   */
  public async sendMessageResult(
    correlationId: string,
    status: NotificationResultEnum,
  ): Promise<void> {
    try {
      await this.vkNotificationProvider.emit(
        NotificationPatternEnum.SEND_RESULT,
        {
          correlationId: correlationId,
          channel: PlatformEnum.VK,
          status: status,
        },
      );
    } catch (error) {
      this.logger.error(normalizeError(error));
    }
  }

  private async handleSendMessage(data: VkSendMessagePayload) {
    const { correlationId, userId, text } = data;
    try {
      const isAllowedSendMessage =
        await this.vkGroupService.isAllowSendMessage(userId);

      if (!isAllowedSendMessage) {
        throw new Error('User not receive messages from groups');
      }

      await this.sendMessageResult(
        correlationId,
        NotificationResultEnum.PROCESSING,
      );

      await this.vkMessageService.sendMessage(userId, text);

      await this.sendMessageResult(
        correlationId,
        NotificationResultEnum.COMPLETED,
      );
    } catch (error) {
      const { message } = normalizeError(error);

      await this.sendMessageResult(
        correlationId,
        NotificationResultEnum.FAILED,
      );
    }
  }

  private async checkUserInGroup(data: VkCheckClientInGroupPayload) {
    try {
      const exists = await this.vkGroupService.checkUserIdGroup(
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
    data: VkCheckClientInGroupPayload,
  ) {
    return this.handleSendWithAck(context, () => this.checkUserInGroup(data));
  }
}
