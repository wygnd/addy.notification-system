import { INotificationReceiveResponse } from '@modules/notifications/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

export class NotificationResponseDTO implements INotificationReceiveResponse {
  @ApiProperty({
    type: String,
    description: 'ID уведомления',
    required: true,
    example: randomUUID(),
  })
  notification_id: string;

  @ApiProperty({
    type: String,
    description:
      'Ответ об успешном сохранении уведомления и постановки в очередь',
  })
  message: string;
}
