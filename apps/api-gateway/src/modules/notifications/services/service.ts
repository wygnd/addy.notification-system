import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  MethodNotAllowedException,
} from '@nestjs/common';
import { INotification } from '@modules/notifications/interfaces/request/interface';
import { VkService } from '@modules/vk/services/service';
import { VkPattern } from '@modules/vk/enums';
import { PlatformEnum } from '@shared/interfaces';
import { NotificationLogService } from '@modules/notifications/services/notification-log/service';
import { NotificationLogStatusEnum } from '@modules/notifications/interfaces';
import { normalizeError } from '@shared/utils/errors';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly vkService: VkService,
    private readonly notificationLogService: NotificationLogService,
  ) {}

  /**
   * Обработка входящих запросов на отправку уведомлений
   */
  public async receiveNotification(fields: INotification) {
    const { userId, platform, requestId, host } = fields;

    const isExists = await this.notificationLogService.exists(requestId);

    if (isExists) {
      throw new ConflictException('Request was handled');
    }

    try {
      // todo identity

      await this.notificationLogService.receiveLog({
        userId: userId.toString(),
        correlationId: requestId,
        channel: platform,
        pattern: `${platform}.message.send`,
        payload: fields,
        status: NotificationLogStatusEnum.RECEIVED,
        source: host,
      });

      switch (fields.platform) {
        case PlatformEnum.VK:
          await this.vkService.emitEvent(VkPattern.SEND_MESSAGE, {
            text: fields.payload.text,
            userId: fields.userId,
          });
          break;

        default:
          throw new MethodNotAllowedException('Invalid platform');
      }

      await this.notificationLogService.markQueued(requestId);

      return {
        message: 'Message was successfully sent',
      };
    } catch (error) {
      const { message } = normalizeError(error);

      this.notificationLogService.markFailed(requestId, message);

      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(error);

      throw new InternalServerErrorException(
        'Произошла непредвиденная ошибка на сервере',
      );
    }
  }
}
