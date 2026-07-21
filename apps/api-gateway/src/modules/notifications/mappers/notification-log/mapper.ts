import { NotificationLogModel } from '@modules/notifications/models';
import { NotificationLogDTO } from '@modules/notifications/dtos';
import { plainToInstance } from 'class-transformer';

export class NotificationLogMapper {
  public static toDomain(model: NotificationLogModel): NotificationLogDTO {
    return plainToInstance(NotificationLogDTO, model, {
      excludeExtraneousValues: true,
    });
  }
}
