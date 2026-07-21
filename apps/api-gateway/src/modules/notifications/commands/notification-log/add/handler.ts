import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationLogAddCommand } from './command';
import { type INotificationLogRepositoryPort } from '@modules/notifications/interfaces';
import { NOTIFICATION_LOG_REPOSITORY } from '@modules/notifications/constants';
import { Inject } from '@nestjs/common';
import { NotificationLogDTO } from '@modules/notifications/dtos/entities/notification-log/dto';
import { NotificationLogMapper } from '@modules/notifications/mappers';

@CommandHandler(NotificationLogAddCommand)
export class NotificationLogAddCommandHandler implements ICommandHandler<NotificationLogAddCommand> {
  constructor(
    @Inject(NOTIFICATION_LOG_REPOSITORY)
    private readonly notificationLogRepo: INotificationLogRepositoryPort,
  ) {}

  public async execute(
    command: NotificationLogAddCommand,
  ): Promise<NotificationLogDTO> {
    const model = await this.notificationLogRepo.create(command.creationFields);

    return NotificationLogMapper.toDomain(model);
  }
}
