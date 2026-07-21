import { notificationLogProviders } from './notification-log/providers';
import { NotificationService } from '@modules/notifications/services';

export const notificationProviders = [
  NotificationService,

  // NOTIFICATION LOG
  ...notificationLogProviders,
];
