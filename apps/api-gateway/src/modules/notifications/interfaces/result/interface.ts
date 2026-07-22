import { NotificationResultEnum } from '@modules/notifications/enums';
import { NotificationLogStatusEnum } from '@modules/notifications/interfaces';
import { PlatformEnum } from '@shared/interfaces';

export interface INotificationResultSendMessagePayload {
  correlationId: string;
  channel: PlatformEnum;
  status: NotificationLogStatusEnum;
}

export interface INotificationResultMap {
  [NotificationResultEnum.SEND_RESULT]: INotificationResultSendMessagePayload;
}
