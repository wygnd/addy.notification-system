import { NotificationLogDTO } from '@modules/notifications/dtos';
import { Query } from '@nestjs/cqrs';

export class NotificationLogGetByCorrelationIdQuery extends Query<NotificationLogDTO | null> {
  constructor(public readonly id: string) {
    super();
  }
}
