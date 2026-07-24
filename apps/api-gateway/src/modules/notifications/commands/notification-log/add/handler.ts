import { NOTIFICATION_LOG_REPOSITORY } from '@modules/notifications/constants';
import { NotificationLogDTO } from '@modules/notifications/dtos/entities/notification-log/dto';
import { type INotificationLogRepositoryPort } from '@modules/notifications/interfaces';
import { NotificationLogMapper } from '@modules/notifications/mappers';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationLogAddCommand } from './command';

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
