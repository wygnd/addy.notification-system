import { Optional, PlatformEnum } from '@addy/common';

export interface INotificationMeta {
  requestId: string;
  host: string;
}

export interface INotificationRequestPayload {
  text: string;
}

export interface INotificationRequest {
  userId: number;
  platform: PlatformEnum;
  payload: INotificationRequestPayload;
}

export type INotification = INotificationRequest & INotificationMeta;

export type INotificationBatchUser = Optional<INotificationRequest, 'payload'>;

export interface INotificationBatchRequest {
  payload?: INotificationRequestPayload;
  users: INotificationBatchUser[];
}

export type INotificationBatch = INotificationBatchRequest & INotificationMeta;
