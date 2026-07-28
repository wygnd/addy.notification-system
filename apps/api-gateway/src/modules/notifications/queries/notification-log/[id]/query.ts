import { NotificationLogDTO } from '@modules/notifications/dtos';
import { Query } from '@nestjs/cqrs';

export class NotificationLogGetByIdQuery extends Query<NotificationLogDTO | null> {
  constructor(public readonly id: string) {
    super();
  }
}
