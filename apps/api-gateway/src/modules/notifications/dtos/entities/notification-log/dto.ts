import {
  NotificationLogStatusEnum,
  TelegramEmitPatternEnum,
} from '@addy/common';
import { PlatformEnum } from '@addy/common';
import {
  INotificationLogEntity,
  type TNotificationLogPayload,
} from '@modules/notifications/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { randomUUID } from 'node:crypto';

export class NotificationLogDTO implements INotificationLogEntity {
  @ApiProperty({
    type: String,
    description: 'ID уведомления',
    required: true,
    example: randomUUID(),
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    description: 'ID, который указывает внешняя сторона при запросе',
    required: true,
    example: randomUUID(),
  })
  @Expose()
  correlationId: string;

  @ApiProperty({
    type: String,
    description: 'Платформа, куда отправляется уведомление',
    enum: PlatformEnum,
    required: true,
    example: PlatformEnum.TELEGRAM,
  })
  @Expose()
  channel: PlatformEnum;

  @ApiProperty({
    type: String,
    description: 'Тип отправленного уведомления',
    required: true,
    example: TelegramEmitPatternEnum.SEND_MESSAGE,
  })
  @Expose()
  pattern: string;

  @ApiProperty({
    type: String,
    description: 'Статус отправленного уведомления',
    enum: NotificationLogStatusEnum,
    required: true,
    example: NotificationLogStatusEnum.COMPLETED,
  })
  @Expose()
  status: NotificationLogStatusEnum;

  @ApiProperty({
    type: String,
    description: 'Данные, которые передала система при отправке уведомления',
    required: true,
    example: {
      text: 'Hello, Alex!',
    },
  })
  @Expose()
  payload: TNotificationLogPayload;

  @ApiProperty({
    type: String,
    description: `Причина ошибки, если status=${NotificationLogStatusEnum.FAILED}`,
    required: false,
    default: null,
    example: 'Пользователь заблокирован',
  })
  @Expose()
  errorMessage: string | null;

  @ApiProperty({
    type: String,
    description: 'ID пользователя в сервисе',
    required: true,
    example: '1',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    type: String,
    description: 'Хост, который отправил запрос',
    required: false,
    default: null,
    example: 'addy.su',
  })
  @Expose()
  source: string | null;

  @ApiProperty({
    type: Number,
    description: 'Количество попыток отправить сообщение',
    required: true,
    default: 1,
    example: 1,
  })
  @Expose()
  retryCount: number;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  completedAt: string | null;
}
