import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { INotificationRequest } from '@modules/notifications/interfaces/request/interface';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor() {}

  /**
   * Обработка входящих запросов на отправку уведомлений
   */
  public async receiveNotification(fields: INotificationRequest) {
    try {

      return {
        message: 'Mock data',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(error);

      throw new InternalServerErrorException(
        'Произошла непредвиденная ошибка на сервере',
      );
    }
  }
}
