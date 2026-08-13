import { NOTIFICATION_LOG_REPOSITORY } from '@modules/notifications/constants';
import { type INotificationLogRepositoryPort } from '@modules/notifications/interfaces';
import { NotificationLogMapper } from '@modules/notifications/mappers';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotificationLogGetByIdQuery } from './query';

@QueryHandler(NotificationLogGetByIdQuery)
export class NotificationLogGetByIdQueryHandler implements IQueryHandler<NotificationLogGetByIdQuery> {
  constructor(
    @Inject(NOTIFICATION_LOG_REPOSITORY)
    private readonly repo: INotificationLogRepositoryPort,
  ) {}

  public async execute(query: NotificationLogGetByIdQuery) {
    const model = await this.repo.getById(query.id);

    if (!model) {
      return null;
    }

    return NotificationLogMapper.toDomain(model);
  }
}
