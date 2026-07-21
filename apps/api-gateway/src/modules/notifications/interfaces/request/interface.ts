import { PlatformEnum } from '@shared/interfaces';

export interface INotificationRequestPayload {
  text: string;
}

export interface INotificationRequest {
  userId: number;
  platform: PlatformEnum;
  payload: INotificationRequestPayload;
}

export interface INotification extends INotificationRequest {
  requestId: string;
  host: string;
}
