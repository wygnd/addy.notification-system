import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  INotificationLogCreateEntity,
  NotificationLogStatusEnum,
} from '@modules/notifications/interfaces';
import { NotificationLogAddCommand } from '@modules/notifications/commands/notification-log/add/command';
import { NotificationLogGetByCorrelationIdQuery } from '@modules/notifications/queries/notification-log/[correlation-id]/query';
import { NotificationLogUpdateByCorrelationIdCommand } from '@modules/notifications/commands/notification-log';

@Injectable()
export class NotificationLogService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
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
}
