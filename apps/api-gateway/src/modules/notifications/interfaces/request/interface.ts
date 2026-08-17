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

export interface INotificationBatchRecipient {
  userId: string;
  platform?: PlatformEnum;
  payload?: INotificationRequestPayload;
}

export interface INotificationBatchRequest {
  defaultPayload?: INotificationRequestPayload;
  recipients: INotificationBatchRecipient[];
}

export type INotificationBatch = INotificationBatchRequest & INotificationMeta;
