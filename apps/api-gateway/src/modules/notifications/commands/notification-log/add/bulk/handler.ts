import { NOTIFICATION_LOG_REPOSITORY } from '@modules/notifications/constants';
import { NotificationLogDTO } from '@modules/notifications/dtos/entities/notification-log/dto';
import { type INotificationLogRepositoryPort } from '@modules/notifications/interfaces';
import { NotificationLogMapper } from '@modules/notifications/mappers';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationLogBulkAddCommand } from './command';

@CommandHandler(NotificationLogBulkAddCommand)
export class NotificationLogBulkAddCommandHandler implements ICommandHandler<NotificationLogBulkAddCommand> {
  constructor(
    @Inject(NOTIFICATION_LOG_REPOSITORY)
    private readonly notificationLogRepo: INotificationLogRepositoryPort,
  ) {}

  public async execute(
    command: NotificationLogBulkAddCommand,
  ): Promise<NotificationLogDTO[]> {
    const models = await this.notificationLogRepo.bulkCreate(command.items);

    return models.map((model) => NotificationLogMapper.toDomain(model));
  }
}
