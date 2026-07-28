import { NotificationLogStatusEnum, PlatformEnum } from '@addy/common';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

export class NotificationDTO {
  @ApiProperty({
    type: String,
    description: 'ID уведомления',
    required: true,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'ID, который указывает внешняя сторона при запросе',
    required: true,
    example: randomUUID(),
  })
  correlation_id: string;

  @ApiProperty({
    type: String,
    description: 'Платформа, куда отправляется уведомление',
    enum: PlatformEnum,
    required: true,
    example: PlatformEnum.TELEGRAM,
  })
  platform: PlatformEnum;

  @ApiProperty({
    type: String,
    description: 'Статус отправленного уведомления',
    enum: NotificationLogStatusEnum,
    required: true,
    example: NotificationLogStatusEnum.COMPLETED,
  })
  status: NotificationLogStatusEnum;

  @ApiProperty({
    type: String,
    description: `Причина ошибки, если status=${NotificationLogStatusEnum.FAILED}`,
    required: false,
    default: null,
    example: null,
  })
  error_message: string | null;

  @ApiProperty({
    type: String,
    description: 'ID пользователя в сервисе',
    required: true,
    example: '1',
  })
  user_id: string;

  @ApiProperty({
    type: Number,
    description: 'Количество попыток повторной отправки уведомления',
    required: true,
    example: 0,
  })
  retry_count: number;
}
