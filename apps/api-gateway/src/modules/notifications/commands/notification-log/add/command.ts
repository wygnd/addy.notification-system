import { NotificationLogDTO } from '@modules/notifications/dtos';
import { INotificationLogCreateEntity } from '@modules/notifications/interfaces';
import { Command } from '@nestjs/cqrs';

export class NotificationLogAddCommand extends Command<NotificationLogDTO> {
  constructor(public readonly creationFields: INotificationLogCreateEntity) {
    super();
  }
}
