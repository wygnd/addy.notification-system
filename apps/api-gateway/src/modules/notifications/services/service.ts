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
  INotificationBatch,
  INotificationBatchError,
  INotificationReceiveResponse,
  INotificationRetryResponse,
} from '@modules/notifications/interfaces';
import { INotification } from '@modules/notifications/interfaces/request/interface';
import { NotificationMapper } from '@modules/notifications/mappers';
import { NotificationLogService } from '@modules/notifications/services/notification-log/service';
import { TelegramService } from '@modules/telegram/services/service';
import { VkService } from '@modules/vk/services/service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(
    private readonly vkService: VkService,
    private readonly notificationLogService: NotificationLogService,
    private readonly identityService: IdentityService,
    private readonly telegramService: TelegramService,
  ) {}

  private async checkNotificationRequestID(requestID: string): Promise<void> {
    if (!requestID) {
      throw new AppException(
        ErrorCodeEnum.VALIDATION_ERROR,
        'X-Request-ID is required',
      );
    }

    const isExists = await this.notificationLogService.exists(requestID);

    if (isExists) {
      throw new AppException(ErrorCodeEnum.NOTIFICATION_WAS_RECEIVED);
    }
  }

  /**
   * Обработка входящих запросов на отправку уведомлений
   */
  public async receiveNotification(
    fields: INotification,
  ): Promise<INotificationReceiveResponse> {
    const { userId, platform, requestId, host } = fields;

    await this.checkNotificationRequestID(requestId);

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
          throw new AppException(ErrorCodeEnum.NOT_ALLOWED, 'Invalid platform');
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
          throw new AppException(ErrorCodeEnum.NOT_ALLOWED, 'Invalid platform');
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

  public async receiveBatchNotification(fields: INotificationBatch) {
    const { requestId, host, payload, users } = fields;

    if (users.length === 0) {
      throw new AppException(
        ErrorCodeEnum.VALIDATION_ERROR,
        'Users must be not empty',
      );
    }

    await this.checkNotificationRequestID(requestId);

    const notification = await this.notificationLogService.receiveLog({
      userId: '',
      correlationId: requestId,
      channel: PlatformEnum.UNKNOWN,
      pattern: `batch.message.send`,
      payload: fields,
      status: NotificationLogStatusEnum.RECEIVED,
      source: host || null,
    });

    const errors: INotificationBatchError[] = [];

    for (const { userId, platform, payload } of users) {
      try {
        const { clientId } = await this.identityService.checkClientConnection({
          userId: userId.toString(),
          platform: platform,
        });
      } catch (error) {
        const { message } = normalizeError(error);

        errors.push({ userId, platform, message });
      }
    }

    // todo
  }
}
