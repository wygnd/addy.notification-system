import { INotificationRetryResponse } from '@modules/notifications/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationRetryResponseDTO implements INotificationRetryResponse {
  @ApiProperty({
    type: String,
    description: 'Статус постановки в очередь',
    required: true,
  })
  message: string;
}
