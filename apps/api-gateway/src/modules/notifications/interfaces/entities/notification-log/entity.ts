import { PlatformEnum } from '@shared/interfaces';
import { Optional } from '@shared/types';

export enum NotificationLogStatusEnum {
  RECEIVED = 'received',
  QUEUED = 'queued',
  SENT_TO_BROKER = 'sent_to_broker',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  UNKNOWN = 'unknown',
}

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
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export type INotificationLogCreateEntity = Optional<
  Omit<INotificationLogEntity, 'id' | 'updatedAt' | 'createdAt'>,
  'errorMessage' | 'source' | 'completedAt'
>;
