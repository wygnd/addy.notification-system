import { INotificationRetryResponse } from '@modules/notifications/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationRetryResponseDTO implements INotificationRetryResponse {
  @ApiProperty({
    type: Boolean,
    description: 'Статус постановки в очередь',
    required: true,
    example: true,
  })
  status: boolean;
}
