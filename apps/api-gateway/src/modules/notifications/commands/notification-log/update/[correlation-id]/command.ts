import { INotificationLogCreateEntity } from '@modules/notifications/interfaces';
import { Command } from '@nestjs/cqrs';

export class NotificationLogUpdateByCorrelationIdCommand extends Command<boolean> {
  constructor(
    public readonly correlationId: string,
    public readonly updateFields: Partial<INotificationLogCreateEntity>,
  ) {
    super();
  }
}
