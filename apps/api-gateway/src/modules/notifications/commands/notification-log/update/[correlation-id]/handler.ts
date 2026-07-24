import { NOTIFICATION_LOG_REPOSITORY } from '@modules/notifications/constants';
import { type INotificationLogRepositoryPort } from '@modules/notifications/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationLogUpdateByCorrelationIdCommand } from './command';

@CommandHandler(NotificationLogUpdateByCorrelationIdCommand)
export class NotificationLogUpdateByCorrelationIdCommandHandler implements ICommandHandler<NotificationLogUpdateByCorrelationIdCommand> {
  constructor(
    @Inject(NOTIFICATION_LOG_REPOSITORY)
    private readonly repo: INotificationLogRepositoryPort,
  ) {}

  public async execute(
    command: NotificationLogUpdateByCorrelationIdCommand,
  ): Promise<boolean> {
    return this.repo.updateByCorrelationId(
      command.correlationId,
      command.updateFields,
    );
  }
}
