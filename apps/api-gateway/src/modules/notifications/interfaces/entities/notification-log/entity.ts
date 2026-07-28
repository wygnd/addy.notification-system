import { NotificationLogStatusEnum, Optional } from '@addy/common';
import { PlatformEnum } from '@addy/common';

export interface INotificationLogEntity {
  id: string;
  correlationId: string;
  channel: PlatformEnum;
  pattern: string;
  status: NotificationLogStatusEnum;
  payload: unknown | null;
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
