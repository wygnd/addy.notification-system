import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import VkBot from 'node-vk-bot-api';
import { normalizeError } from '@shared/utils';
import { NotificationPatternEnum, NotificationResultEnum } from '@shared/enums';
import { VkNotificationProvider } from '@modules/vk/providers/provider';
import { PlatformEnum } from '@shared/interfaces';
import { RmqContext } from '@nestjs/microservices';
import {
  VkCheckClientInGroupPayload,
  VkSendMessagePayload,
} from '@modules/vk/interfaces';
import { IGroupGetMembersResponse } from '@modules/vk/interfaces/api/groups';

@Injectable()
export class VkService {
  private readonly logger = new Logger(VkService.name);
  private readonly bot: VkBot;
  private readonly vkGroupId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly vkNotificationProvider: VkNotificationProvider,
  ) {
    const token = this.configService.getOrThrow<string>('VK_BOT_API_KEY');

    this.bot = new VkBot(token);

    this.vkGroupId = this.configService.getOrThrow<string>('VK_ADDY_GROUP_ID');
  }

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

  public async sendMessage(userId: number, message: string): Promise<void> {
    try {
      await this.bot.sendMessage(userId, message);
    } catch (err) {
      this.logger.error(normalizeError(err));
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
    const { correlationId } = data;

    await this.sendMessageResult(
      correlationId,
      NotificationResultEnum.PROCESSING,
    );

    await this.sendMessage(data.userId, data.text);

    await this.sendMessageResult(
      correlationId,
      NotificationResultEnum.COMPLETED,
    );
  }

  private async checkUserInGroup(data: VkCheckClientInGroupPayload) {
    try {
      const response: IGroupGetMembersResponse =
        await this.bot.execute('groups.getMembers', {
          group_id: this.vkGroupId,
        });

      if (response.items.includes(Number(data.userId))) {
        return {
          status: true,
          message: 'Пользователь подписан на сообщество',
        };
      }

      return {
        status: false,
        message: 'Пользователь не подписан на сообщество',
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
