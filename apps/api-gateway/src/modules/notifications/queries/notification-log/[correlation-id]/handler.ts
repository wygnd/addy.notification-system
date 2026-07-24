import { NOTIFICATION_LOG_REPOSITORY } from '@modules/notifications/constants';
import { type INotificationLogRepositoryPort } from '@modules/notifications/interfaces';
import { NotificationLogMapper } from '@modules/notifications/mappers';
import { NotificationLogGetByCorrelationIdQuery } from '@modules/notifications/queries/notification-log/[correlation-id]/query';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

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
