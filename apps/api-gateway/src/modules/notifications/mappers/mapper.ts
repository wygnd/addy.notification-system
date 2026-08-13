import {
  NotificationDTO,
  NotificationLogDTO,
} from '@modules/notifications/dtos';

export class NotificationMapper {
  public static fromNotificationLog(dto: NotificationLogDTO): NotificationDTO {
    return {
      id: dto.id,
      correlation_id: dto.correlationId,
      user_id: dto.userId,
      status: dto.status,
      platform: dto.channel,
      retry_count: dto.retryCount,
      error_message: dto.errorMessage,
    };
  }
}
