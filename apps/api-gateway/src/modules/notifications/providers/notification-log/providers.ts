import { NOTIFICATION_LOG_REPOSITORY } from '@modules/notifications/constants';
import { NotificationLogRepository } from '@modules/notifications/repositories/notification-log/repository';
import { NotificationLogService } from '@modules/notifications/services';
import { NotificationLogGetByCorrelationIdQueryHandler } from '@modules/notifications/queries/notification-log';
import {
  NotificationLogAddCommandHandler,
  NotificationLogUpdateByCorrelationIdCommandHandler,
} from '@modules/notifications/commands/notification-log';

export const notificationLogProviders = [
  // SERVICES
  NotificationLogService,

  // REPOSITORIES
  {
    provide: NOTIFICATION_LOG_REPOSITORY,
    useClass: NotificationLogRepository,
  },

  // COMMANDS
  NotificationLogAddCommandHandler,
  NotificationLogUpdateByCorrelationIdCommandHandler,

  // QUERIES
  NotificationLogGetByCorrelationIdQueryHandler,
];
