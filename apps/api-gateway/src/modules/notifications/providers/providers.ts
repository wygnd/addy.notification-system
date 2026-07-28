import { NotificationLogGetByIdQueryHandler } from '@modules/notifications/queries/notification-log';
import { NotificationService } from '@modules/notifications/services';
import { notificationLogProviders } from './notification-log/providers';
import { notificationResultProviders } from './result/providers';

export const notificationProviders = [
  NotificationService,

  // NOTIFICATION LOG
  ...notificationLogProviders,

  // NOTIFICATION RESULT
  ...notificationResultProviders,

  NotificationLogGetByIdQueryHandler,
];
