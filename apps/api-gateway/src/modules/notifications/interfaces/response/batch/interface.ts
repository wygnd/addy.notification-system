import { PlatformEnum } from '@addy/common';

export interface INotificationBatchError {
  message: string;
  userId: number;
  platform: PlatformEnum;
}
