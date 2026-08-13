import {
  AppException,
  ErrorCodeEnum,
  NotificationLogStatusEnum,
} from '@addy/common';
import { NotificationLogUpdateByCorrelationIdCommand } from '@modules/notifications/commands/notification-log';
import { NotificationLogAddCommand } from '@modules/notifications/commands/notification-log/add/command';
import { NotificationLogDTO } from '@modules/notifications/dtos';
import { INotificationLogCreateEntity } from '@modules/notifications/interfaces';
import { NotificationLogGetByIdQuery } from '@modules/notifications/queries/notification-log';
import { NotificationLogGetByCorrelationIdQuery } from '@modules/notifications/queries/notification-log/[correlation-id]/query';
import { REDIS_KEYS } from '@modules/redis/constants/constants';
import { RedisService } from '@modules/redis/services/service';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class NotificationLogService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly redisService: RedisService,
  ) {}

  public async receiveLog(fields: INotificationLogCreateEntity) {
    return this.commandBus.execute(new NotificationLogAddCommand(fields));
  }

  public async exists(correlationId: string): Promise<boolean> {
    try {
      const notificationDto = await this.queryBus.execute(
        new NotificationLogGetByCorrelationIdQuery(correlationId),
      );

      return !!notificationDto;
    } catch {
      return false;
    }
  }

  public async markQueued(correlationId: string): Promise<void> {
    await this.commandBus.execute(
      new NotificationLogUpdateByCorrelationIdCommand(correlationId, {
        status: NotificationLogStatusEnum.QUEUED,
      }),
    );
  }

  public async markFailed(
    correlationId: string,
    errMessage: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new NotificationLogUpdateByCorrelationIdCommand(correlationId, {
        status: NotificationLogStatusEnum.FAILED,
        errorMessage: errMessage,
      }),
    );
  }

  public async getNotificationById(notificationId: string) {
    const notificationRedisKey = REDIS_KEYS.NOTIFICATION_ID + notificationId;

    const cacheNotification =
      await this.redisService.get<NotificationLogDTO>(notificationRedisKey);

    if (cacheNotification) {
      return cacheNotification;
    }

    const notification = await this.queryBus.execute(
      new NotificationLogGetByIdQuery(notificationId),
    );

    if (!notification) {
      throw new AppException(ErrorCodeEnum.NOTIFICATION_NOT_FOUND);
    }

    await this.redisService.set<NotificationLogDTO>(
      notificationRedisKey,
      notification,
      120,
    );

    return notification;
  }

  public async increaseRetryCount(notificationId: string) {
    const notification = await this.queryBus.execute(
      new NotificationLogGetByIdQuery(notificationId),
    );

    if (!notification) {
      return false;
    }

    return this.commandBus.execute(
      new NotificationLogUpdateByCorrelationIdCommand(
        notification.correlationId,
        {
          retryCount: notification.retryCount + 1,
        },
      ),
    );
  }
}
