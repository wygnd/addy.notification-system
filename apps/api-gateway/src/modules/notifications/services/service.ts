import {
  AppException,
  ErrorCodeEnum,
  normalizeError,
  NotificationLogStatusEnum,
  PlatformEnum,
} from '@addy/common';
import { IdentityService } from '@modules/identity/services/service';
import { NotificationLogBulkAddCommand } from '@modules/notifications/commands/notification-log';
import {
  NotificationDTO,
  NotificationLogDTO,
} from '@modules/notifications/dtos';
import { NotificationLogPayloadEnum } from '@modules/notifications/enums';
import {
  INotificationBatch,
  INotificationBatchRecipientError,
  INotificationBatchResponse,
  INotificationLogCreateEntity,
  INotificationReceiveResponse,
  INotificationRetryResponse,
} from '@modules/notifications/interfaces';
import { INotification } from '@modules/notifications/interfaces/request/interface';
import { NotificationMapper } from '@modules/notifications/mappers';
import { NotificationLogService } from '@modules/notifications/services/notification-log/service';
import { TelegramService } from '@modules/telegram/services/service';
import { VkService } from '@modules/vk/services/service';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { randomBytes } from 'crypto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly vkService: VkService,
    private readonly notificationLogService: NotificationLogService,
    private readonly identityService: IdentityService,
    private readonly telegramService: TelegramService,
    private readonly commandBus: CommandBus,
  ) {}

  private async checkNotificationRequestId(requestId: string): Promise<void> {
    if (!requestId) {
      throw new AppException(
        ErrorCodeEnum.VALIDATION_ERROR,
        'X-Request-ID is required',
      );
    }

    const isExists = await this.notificationLogService.exists(requestId);

    if (isExists) {
      throw new AppException(ErrorCodeEnum.NOTIFICATION_WAS_RECEIVED);
    }
  }

  private async sendNotification(
    platformUserId: string,
    notification: NotificationLogDTO,
  ) {
    const { payload } = notification;

    if (!payload) {
      throw new AppException(ErrorCodeEnum.NOTIFICATION_EMPTY_PAYLOAD);
    }

    if (payload.type !== NotificationLogPayloadEnum.NOTIFICATION) {
      throw new AppException(ErrorCodeEnum.NOTIFICATION_INVALID_PAYLOAD);
    }

    const { platform, payload: notificationPayload, requestId } = payload.data;

    try {
      switch (platform) {
        case PlatformEnum.VK:
          await this.vkService.sendMessage({
            text: notificationPayload.text,
            userId: platformUserId,
            correlationId: requestId,
          });
          break;

        case PlatformEnum.TELEGRAM:
          await this.telegramService.sendMessage({
            text: notificationPayload.text,
            userId: platformUserId,
            correlationId: requestId,
          });
          break;

        default:
          throw new AppException(ErrorCodeEnum.NOT_ALLOWED, 'Invalid platform');
      }

      await this.notificationLogService.markQueued(requestId);
    } catch (error) {
      const { message } = normalizeError(error);

      await this.notificationLogService.markFailed(requestId, message);

      throw error;
    }
  }

  /**
   * Обработка входящих запросов на отправку уведомлений
   */
  public async receiveNotification(
    fields: INotification,
  ): Promise<INotificationReceiveResponse> {
    const { userId, platform, requestId, host } = fields;

    await this.checkNotificationRequestId(requestId);

    const { clientId } = await this.identityService.checkClientConnection({
      userId: userId.toString(),
      platform: platform,
    });

    const notification = await this.notificationLogService.receiveLog({
      userId: userId.toString(),
      correlationId: requestId,
      channel: platform,
      pattern: `${platform}.message.send`,
      payload: {
        type: NotificationLogPayloadEnum.NOTIFICATION,
        data: fields,
      },
      status: NotificationLogStatusEnum.RECEIVED,
      source: host || null,
    });

    await this.sendNotification(clientId, notification);

    return {
      message: 'Message was successfully sent',
      notification_id: notification.id,
    };
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
    if (!notificationId) {
      throw new AppException(
        ErrorCodeEnum.VALIDATION_ERROR,
        'NotificationID is required',
      );
    }

    // Пытаемся получить данные
    const notification =
      await this.notificationLogService.getNotificationById(notificationId);

    // Если у сообщения статус не ошибочный: возможно оно еще дослылается
    if (notification.status !== NotificationLogStatusEnum.FAILED) {
      throw new AppException(ErrorCodeEnum.NOTIFICATION_NOT_RETRYABLE);
    }

    const { clientId } = await this.identityService.checkClientConnection({
      userId: notification.userId,
      platform: notification.channel,
    });

    await this.sendNotification(clientId, notification);

    return {
      message: 'Notification successfully retrieved',
    };
  }

  /**
   * Отправляет массовую рассылку
   * @param fields
   */
  public async receiveBatchNotification(
    fields: INotificationBatch,
  ): Promise<INotificationBatchResponse> {
    const { requestId, host, defaultPayload, recipients } = fields;
    const { items: clientsConnectedPlatforms } =
      await this.identityService.getConnectedPlatforms({
        clientIds: recipients.map((r) => r.userId),
      });

    const clientHandledIds = new Set<string>();
    const clientErrorList: INotificationBatchRecipientError[] = [];
    const addNotificationList: INotificationLogCreateEntity[] = [];

    for (const recipient of recipients) {
      if (clientHandledIds.has(recipient.userId)) {
        continue;
      }

      const payload = recipient.payload ?? defaultPayload;
      let platformList: PlatformEnum[] = [];

      // Если не удалось получить информацию о подключенном пользователе: пропускаем
      if (!(recipient.userId in clientsConnectedPlatforms)) {
        clientErrorList.push({
          user_id: recipient.userId,
          message: 'Not found connected platforms',
        });

        clientHandledIds.add(recipient.userId);
        continue;
      }

      // Если была указана платформа: то только на нее отправляем
      if (recipient.platform) {
        platformList.push(recipient.platform);
      }
      // Если не указали, пытаемся получить платформы, к которым подключен клиент
      else {
        for (const clientPlatform of clientsConnectedPlatforms[
          recipient.userId
        ]) {
          // Если платформа не подключена или не подключена до конца: пропускаем
          if (!clientPlatform.connected) {
            continue;
          }

          platformList.push(clientPlatform.platform);
        }
      }

      for (const platform of platformList) {
        addNotificationList.push({
          userId: recipient.userId,
          correlationId: `${requestId}-${randomBytes(4).toString('hex')}`,
          channel: platform,
          pattern: `${platform}.message.send`,
          payload: {
            type: NotificationLogPayloadEnum.NOTIFICATION,
            data: {
              payload: payload,
              requestId: requestId,
              platform: platform,
              host: host,
              userId: Number(recipient.userId),
            },
          },
          status: NotificationLogStatusEnum.RECEIVED,
          source: host || null,
        });
      }

      clientHandledIds.add(recipient.userId);
    }

    const notificationList = await this.commandBus.execute(
      new NotificationLogBulkAddCommand(addNotificationList),
    );

    for (const notification of notificationList) {
      if (
        !notification.payload ||
        notification.payload.type !== NotificationLogPayloadEnum.NOTIFICATION
      ) {
        continue;
      }

      switch (notification.channel) {
        case PlatformEnum.VK:
          break;
      }

    }
    // todo создать нотификации и отправить по сервисам

    return {
      errors: Array.from(clientErrorList.values()),
    };
  }
}
