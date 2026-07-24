import {
  INotificationLogCreateEntity,
  INotificationLogRepositoryPort,
} from '@modules/notifications/interfaces';
import { NotificationLogModel } from '@modules/notifications/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class NotificationLogRepository implements INotificationLogRepositoryPort {
  constructor(
    @InjectModel(NotificationLogModel)
    private readonly repo: typeof NotificationLogModel,
  ) {}

  public async create(
    fields: INotificationLogCreateEntity,
  ): Promise<NotificationLogModel> {
    return this.repo.create(fields);
  }

  public async getByCorrelationId(
    correlationId: string,
  ): Promise<NotificationLogModel | null> {
    return this.repo.findOne({
      where: { correlationId },
    });
  }

  public async updateByCorrelationId(
    correlationId: string,
    updateFields: Partial<INotificationLogCreateEntity>,
  ): Promise<boolean> {
    const [updated] = await this.repo.update(updateFields, {
      where: { correlationId },
    });

    return updated > 0;
  }
}
