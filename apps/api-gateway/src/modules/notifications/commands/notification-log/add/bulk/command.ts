import { NotificationLogDTO } from '@modules/notifications/dtos';
import { INotificationLogCreateEntity } from '@modules/notifications/interfaces';
import { Command } from '@nestjs/cqrs';

export class NotificationLogBulkAddCommand extends Command<NotificationLogDTO[]> {
  constructor(public readonly items: INotificationLogCreateEntity[]) {
    super();
  }
}
