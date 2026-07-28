import { INotificationLogCreateEntity } from '@modules/notifications/interfaces';
import { NotificationLogModel } from '@modules/notifications/models';

export interface INotificationLogRepositoryPort {
  create(fields: INotificationLogCreateEntity): Promise<NotificationLogModel>;
  updateByCorrelationId(
    correlationId: string,
    updateFields: Partial<INotificationLogCreateEntity>,
  ): Promise<boolean>;
  getByCorrelationId(
    correlationId: string,
  ): Promise<NotificationLogModel | null>;
  getById(id: string): Promise<NotificationLogModel | null>;
}
