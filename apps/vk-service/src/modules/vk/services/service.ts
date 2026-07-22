import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import VkBot from 'node-vk-bot-api';
import { normalizeError } from '@shared/utils';
import { NotificationPatternEnum, NotificationResultEnum } from '@shared/enums';
import { VkNotificationProvider } from '@modules/vk/providers/provider';
import { PlatformEnum } from '@shared/interfaces';

@Injectable()
export class VkService {
  private readonly logger = new Logger(VkService.name);
  private readonly bot: VkBot;

  constructor(
    private readonly configService: ConfigService,
    private readonly vkNotificationProvider: VkNotificationProvider,
  ) {
    const token = this.configService.getOrThrow<string>('VK_BOT_API_KEY');

    this.bot = new VkBot(token);
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
}
