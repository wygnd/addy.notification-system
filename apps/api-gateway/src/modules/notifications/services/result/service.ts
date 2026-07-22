import { Injectable } from '@nestjs/common';
import { INotificationResultSendMessagePayload } from '@modules/notifications/interfaces';
import { CommandBus } from '@nestjs/cqrs';
import { NotificationLogUpdateByCorrelationIdCommand } from '@modules/notifications/commands/notification-log';

@Injectable()
export class NotificationResultService {
  constructor(private readonly commandBus: CommandBus) {}

  public async receiveNotificationResult(
    data: INotificationResultSendMessagePayload,
  ) {
    await this.commandBus.execute(
      new NotificationLogUpdateByCorrelationIdCommand(data.correlationId, {
        status: data.status,
      }),
    );
  }
}
