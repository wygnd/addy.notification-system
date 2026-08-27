import {
  ITelegramSendMessagePayload,
  normalizeError,
  NotificationLogStatusEnum,
  PlatformEnum,
} from '@addy/common';
import { TELEGRAM_BOT } from '@modules/telegram/constants';
import { TelegramNotificationProvider } from '@modules/telegram/providers/provider';
import { TelegramBotApiService } from '@modules/telegram/services/api';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { Bot } from 'grammy';
import type { Update } from 'grammy/types';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  constructor(
    @Inject(TELEGRAM_BOT)
    private readonly bot: Bot,
    private readonly telegramBotService: TelegramBotApiService,
    private readonly telegramNotificationProvider: TelegramNotificationProvider,
  ) {}

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
      await this.telegramNotificationProvider.sendMessageResult({
        correlationId: correlationId,
        channel: PlatformEnum.TELEGRAM,
        status: status,
        errorMessage: errMessage,
      });
    } catch (error) {
      this.logger.error(normalizeError(error));
    }
  }

  private async sendMessage(data: ITelegramSendMessagePayload) {
    const { userId, text, correlationId } = data;
    try {
      await this.sendMessageResult(
        correlationId,
        NotificationLogStatusEnum.PROCESSING,
      );

      await this.telegramBotService.sendMessage(userId, text);

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

  public async handleWebhook(body: Update) {
    await this.bot.handleUpdate(body);
  }

  public async handleSendMessage(
    context: RmqContext,
    data: ITelegramSendMessagePayload,
  ): Promise<void> {
    return this.handleEmitWithAck(context, () => this.sendMessage(data));
  }
}
