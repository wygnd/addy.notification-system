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
import { IPlatformMessenger } from '@shared/interfaces';
import { randomBytes } from 'crypto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class NotificationService {
  private readonly messengers: Record<PlatformEnum, IPlatformMessenger | null>;

  constructor(
    private readonly vkService: VkService,
    private readonly notificationLogService: NotificationLogService,
    private readonly identityService: IdentityService,
    private readonly telegramService: TelegramService,
    private readonly commandBus: CommandBus,
  ) {
    this.messengers = {
      [PlatformEnum.VK]: this.vkService,
      [PlatformEnum.TELEGRAM]: this.telegramService,
      [PlatformEnum.UNKNOWN]: null,
      [PlatformEnum.MAX]: null,
    };
  }

  /**
   * Проверяет уведомление по X-Request-ID
   * @param requestId
   * @private
   */
  private async checkNotificationRequestId(requestId: string): Promise<void> {
    if (!requestId) {
      throw new AppException(
        ErrorCodeEnum.VALIDATION_ERROR,
        'notification_id is required',
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
      const messenger = this.messengers[platform];

      if (!messenger) {
        throw new AppException(ErrorCodeEnum.NOT_ALLOWED, 'Invalid platform');
      }

      await messenger.sendMessage({
        userId: platformUserId,
        correlationId: notification.correlationId,
        text: notificationPayload.text,
      });

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
    await this.checkNotificationRequestId(fields.requestId);

    const { requestId, host, defaultPayload, recipients } = fields;
    const { items: clientsConnectedPlatforms } =
      await this.identityService.getConnectedPlatforms({
        clientIds: recipients.map((r) => r.userId),
      });

    const clientHandledIds = new Set<string>();
    const clientIdPlatformUserIdMap = new Map<string, string>();
    const clientErrorList: INotificationBatchRecipientError[] = [];
    const addNotificationList: INotificationLogCreateEntity[] = [];

    for (const recipient of recipients) {
      const userIdNumber = Number(recipient.userId);

      if (clientHandledIds.has(recipient.userId)) {
        continue;
      }

      const payload = recipient.payload ?? defaultPayload;

      if (!payload) {
        throw new AppException(
          ErrorCodeEnum.VALIDATION_ERROR,
          'payload обязателен',
        );
      }

      let platformList: PlatformEnum[] = [];

      // Если не удалось получить информацию о подключенном пользователе: пропускаем
      if (!(recipient.userId in clientsConnectedPlatforms)) {
        clientErrorList.push({
          user_id: userIdNumber,
          message: 'Not found connected platforms',
        });

        clientHandledIds.add(recipient.userId);
        continue;
      }

      // Если была указана платформа: то только на нее отправляем
      if (recipient.platform) {
        // Ищем платформу и проверяем, подключена ли она
        const findPlatform = clientsConnectedPlatforms[recipient.userId].find(
          (p) => p.platform === recipient.platform,
        );

        // Если не нашли - пропускаем и добавляем к ошибкам
        if (!findPlatform) {
          clientErrorList.push({
            user_id: userIdNumber,
            message: `Platform does not exists: ${recipient.platform}`,
          });

          clientHandledIds.add(recipient.userId);
          continue;
        }

        // Если платформа не подключена - пропускаем и добавляем к ошибкам
        if (!findPlatform.connected) {
          clientErrorList.push({
            user_id: userIdNumber,
            message: `Client does not connected to ${recipient.platform}`,
          });

          clientHandledIds.add(recipient.userId);
          continue;
        }

        platformList.push(recipient.platform);
      }
      // Если не указали, пытаемся получить платформы, к которым подключен клиент
      else {
        for (const clientPlatform of clientsConnectedPlatforms[
          recipient.userId
        ]) {
          console.log('start', clientPlatform.platform);

          // Если платформа не подключена или не подключена до конца: пропускаем
          if (!clientPlatform.connected) {
            continue;
          }

          platformList.push(clientPlatform.platform);
          clientIdPlatformUserIdMap.set(
            `${recipient.userId}-${clientPlatform.platform}`,
            clientPlatform.platformUserId ?? '',
          );
        }
      }

      // Проходим по всем платформам и формируем список для хранения уведомления в БД
      for (const platform of platformList) {
        addNotificationList.push({
          userId: recipient.userId,
          correlationId: randomUUID(),
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

    // Инсертим уведомления в БД
    const notificationList = await this.commandBus.execute(
      new NotificationLogBulkAddCommand(addNotificationList),
    );

    let sendNotificationCount = 0;

    // Проходим по уведомлениям и отправляем в очередь сообщения
    for (const notification of notificationList) {
      if (
        !notification.payload ||
        notification.payload.type !== NotificationLogPayloadEnum.NOTIFICATION
      ) {
        continue;
      }

      const platformUserId = clientIdPlatformUserIdMap.get(
        `${notification.userId}-${notification.channel}`,
      );

      console.log(platformUserId);

      if (!platformUserId) {
        continue;
      }

      try {
        await this.sendNotification(platformUserId, notification);
        sendNotificationCount++;
      } catch {}
    }

    let result: INotificationBatchResponse = {
      message: 'Данные приняты',
    };

    if (sendNotificationCount > 0) {
      result['message'] =
        `Уведомлений отправлено в обработку: ${sendNotificationCount}`;
    }

    if (clientErrorList.length > 0) {
      result['errors'] = clientErrorList;
    }

    return result;
  }
}
