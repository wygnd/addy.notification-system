import {
  INotificationBatchRecipientError,
  INotificationBatchResponse,
} from '@modules/notifications/interfaces';
import { ApiProperty } from '@nestjs/swagger';

class NotificationBatchErrorDTO implements INotificationBatchRecipientError {
  @ApiProperty({
    type: String,
    description: 'Текст ошибки',
  })
  message: string;

  @ApiProperty({
    type: Number,
    description: 'ID пользователя',
  })
  user_id: number;
}

export class NotificationBatchResponseDTO implements INotificationBatchResponse {
  @ApiProperty({
    type: String,
    description: 'Сообщение',
    required: true,
  })
  message: string;

  @ApiProperty({
    type: NotificationBatchErrorDTO,
    description: 'Ошибки',
    isArray: true,
  })
  errors: NotificationBatchErrorDTO[];
}
