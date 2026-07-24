import {
  INotificationResultSendMessagePayload,
  NotificationLogStatusEnum,
} from '@addy/common';
import { NotificationLogUpdateByCorrelationIdCommand } from '@modules/notifications/commands/notification-log';
import { INotificationLogCreateEntity } from '@modules/notifications/interfaces';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class NotificationResultService {
  constructor(private readonly commandBus: CommandBus) {}

  public async receiveNotificationResult(
    data: INotificationResultSendMessagePayload,
  ) {
    const { correlationId, status, errorMessage = '' } = data;
    const updateFields: Partial<INotificationLogCreateEntity> = {
      status: status,
    };

    if (status === NotificationLogStatusEnum.FAILED && errorMessage) {
      updateFields.errorMessage = errorMessage;
    }

    await this.commandBus.execute(
      new NotificationLogUpdateByCorrelationIdCommand(
        correlationId,
        updateFields,
      ),
    );
  }
}
