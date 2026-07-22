import { notificationLogProviders } from './notification-log/providers';
import { NotificationService } from '@modules/notifications/services';
import { notificationResultProviders } from './result/providers';

export const notificationProviders = [
  NotificationService,

  // NOTIFICATION LOG
  ...notificationLogProviders,

  // NOTIFICATION RESULT
  ...notificationResultProviders,
];
