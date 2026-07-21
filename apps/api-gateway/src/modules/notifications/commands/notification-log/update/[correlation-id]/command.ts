import { Command } from '@nestjs/cqrs';
import { INotificationLogCreateEntity } from '@modules/notifications/interfaces';

export class NotificationLogUpdateByCorrelationIdCommand extends Command<boolean> {
  constructor(
    public readonly correlationId: string,
    public readonly updateFields: Partial<INotificationLogCreateEntity>,
  ) {
    super();
  }
}
