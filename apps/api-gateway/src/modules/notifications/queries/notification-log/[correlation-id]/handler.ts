import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotificationLogGetByCorrelationIdQuery } from '@modules/notifications/queries/notification-log/[correlation-id]/query';
import { type INotificationLogRepositoryPort } from '@modules/notifications/interfaces';
import { Inject } from '@nestjs/common';
import { NOTIFICATION_LOG_REPOSITORY } from '@modules/notifications/constants';
import { NotificationLogMapper } from '@modules/notifications/mappers';

@QueryHandler(NotificationLogGetByCorrelationIdQuery)
export class NotificationLogGetByCorrelationIdQueryHandler implements IQueryHandler<NotificationLogGetByCorrelationIdQuery> {
  constructor(
    @Inject(NOTIFICATION_LOG_REPOSITORY)
    private readonly repo: INotificationLogRepositoryPort,
  ) {}

  public async execute(query: NotificationLogGetByCorrelationIdQuery) {
    const model = await this.repo.getByCorrelationId(query.id);

    if (!model) {
      return null;
    }

    return NotificationLogMapper.toDomain(model);
  }
}
