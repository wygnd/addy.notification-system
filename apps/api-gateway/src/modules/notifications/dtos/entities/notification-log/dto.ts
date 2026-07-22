import {
  INotificationLogEntity,
  NotificationLogStatusEnum,
} from '@modules/notifications/interfaces';
import { PlatformEnum } from '@shared/interfaces';
import { VkEmitPatternEnum } from '@modules/vk/enums';
import { Expose } from 'class-transformer';

export class NotificationLogDTO implements INotificationLogEntity {
  @Expose()
  id: string;

  @Expose()
  correlationId: string;

  @Expose()
  channel: PlatformEnum;

  @Expose()
  pattern: VkEmitPatternEnum;

  @Expose()
  status: NotificationLogStatusEnum;

  @Expose()
  payload: Record<string, unknown> | null;

  @Expose()
  errorMessage: string | null;

  @Expose()
  userId: string;

  @Expose()
  source: string | null;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  completedAt: string | null;
}
