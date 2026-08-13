import { NotificationLogStatusEnum, Optional } from '@addy/common';
import { PlatformEnum } from '@addy/common';
import { NotificationLogPayloadEnum } from '@modules/notifications/enums';
import {
  INotification,
  INotificationLogRepositoryPort,
} from '@modules/notifications/interfaces';

export interface INotificationLogEntity {
  id: string;
  correlationId: string;
  channel: PlatformEnum;
  pattern: string;
  status: NotificationLogStatusEnum;
  payload: TNotificationLogPayload;
  errorMessage: string | null;
  userId: string;
  source: string | null;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export type INotificationLogCreateEntity = Optional<
  Omit<INotificationLogEntity, 'id' | 'updatedAt' | 'createdAt'>,
  'errorMessage' | 'source' | 'retryCount' | 'completedAt'
>;

export interface INotificationLogPayloadNotification {
  type: NotificationLogPayloadEnum.NOTIFICATION;
  data: INotification;
}

export type TNotificationLogPayload =
  INotificationLogPayloadNotification | null;
