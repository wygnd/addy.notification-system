import {
  NotificationLogStatusEnum,
  NotificationResultEnum,
  PlatformEnum,
} from '@src/enums';

export interface INotificationResultSendMessagePayload {
  correlationId: string;
  channel: PlatformEnum;
  status: NotificationLogStatusEnum;
  errorMessage?: string;
}

export interface INotificationResultMap {
  [NotificationResultEnum.SEND_RESULT]: INotificationResultSendMessagePayload;
}
