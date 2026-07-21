import { INotificationLogCreateEntity } from '@modules/notifications/interfaces';
import { Command } from '@nestjs/cqrs';
import { NotificationLogDTO } from '@modules/notifications/dtos';

export class NotificationLogAddCommand extends Command<NotificationLogDTO> {
  constructor(public readonly creationFields: INotificationLogCreateEntity) {
    super();
  }
}
