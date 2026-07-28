import {
  AppException,
  ErrorCodeEnum,
  normalizeError,
  NotificationLogStatusEnum,
  PlatformEnum,
} from '@addy/common';
import { IdentityService } from '@modules/identity/services/service';
import { NotificationDTO } from '@modules/notifications/dtos';
import {
  INotificationReceiveResponse,
  INotificationRetryResponse,
} from '@modules/notifications/interfaces';
import { INotification } from '@modules/notifications/interfaces/request/interface';
import { NotificationMapper } from '@modules/notifications/mappers';
import { NotificationLogService } from '@modules/notifications/services/notification-log/service';
import { TelegramService } from '@modules/telegram/services/service';
import { VkService } from '@modules/vk/services/service';
import {
  ConflictException,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(
    private readonly vkService: VkService,
    private readonly notificationLogService: NotificationLogService,
    private readonly identityService: IdentityService,
    private readonly telegramService: TelegramService,
  ) {}

  /**
   * Обработка входящих запросов на отправку уведомлений
   */
  public async receiveNotification(
    fields: INotification,
  ): Promise<INotificationReceiveResponse> {
    const { userId, platform, requestId, host } = fields;

    const isExists = await this.notificationLogService.exists(requestId);

    if (isExists) {
      throw new ConflictException('Request was handled');
    }

    const { clientId } = await this.identityService.checkClientConnection({
      userId: userId.toString(),
      platform: platform,
    });

    const notification = await this.notificationLogService.receiveLog({
      userId: userId.toString(),
      correlationId: requestId,
      channel: platform,
      pattern: `${platform}.message.send`,
      payload: fields,
      status: NotificationLogStatusEnum.RECEIVED,
      source: host || null,
    });

    try {
      switch (fields.platform) {
        case PlatformEnum.VK:
          await this.vkService.sendMessage({
            text: fields.payload.text,
            userId: clientId,
            correlationId: requestId,
          });
          break;

        case PlatformEnum.TELEGRAM:
          await this.telegramService.sendMessage({
            text: fields.payload.text,
            userId: clientId,
            correlationId: requestId,
          });
          break;

        default:
          throw new MethodNotAllowedException('Invalid platform');
      }

      await this.notificationLogService.markQueued(requestId);

      return {
        message: 'Message was successfully sent',
        notification_id: notification.id,
      };
    } catch (error) {
      const { message } = normalizeError(error);

      await this.notificationLogService.markFailed(requestId, message);

      throw error;
    }
  }

  public async getNotificationById(
    notificationId: string,
  ): Promise<NotificationDTO> {
    if (!notificationId) {
      throw new AppException(ErrorCodeEnum.NOTIFICATION_ID_REQUIRED);
    }

    const notification =
      await this.notificationLogService.getNotificationById(notificationId);

    return NotificationMapper.fromNotificationLog(notification);
  }

  public async retryNotification(
    notificationId: string,
  ): Promise<INotificationRetryResponse> {
    const notification =
      await this.notificationLogService.getNotificationById(notificationId);

    if (notification.status !== NotificationLogStatusEnum.FAILED) {
      throw new AppException(ErrorCodeEnum.NOTIFICATION_NOT_RETRYABLE);
    }

    if (!notification.payload) {
      throw new AppException(ErrorCodeEnum.NOTIFICATION_EMPTY_PAYLOAD);
    }

    try {
      await Promise.all([
        this.notificationLogService.markQueued(notification.correlationId),
        this.notificationLogService.increaseRetryCount(notificationId),
      ]);

      const { clientId } = await this.identityService.checkClientConnection({
        userId: notification.userId,
        platform: notification.channel,
      });

      const {
        payload: { text },
      } = notification.payload as INotification;

      switch (notification.channel) {
        case PlatformEnum.VK:
          await this.vkService.sendMessage({
            text: text,
            userId: clientId,
            correlationId: notification.correlationId,
          });
          break;

        case PlatformEnum.TELEGRAM:
          await this.telegramService.sendMessage({
            text: text,
            userId: clientId,
            correlationId: notification.correlationId,
          });
          break;

        default:
          throw new MethodNotAllowedException('Invalid platform');
      }

      return {
        status: true,
      };
    } catch (error) {
      const { message } = normalizeError(error);

      await this.notificationLogService.markFailed(
        notification.correlationId,
        message,
      );

      return {
        status: false,
      };
    }
  }
}
