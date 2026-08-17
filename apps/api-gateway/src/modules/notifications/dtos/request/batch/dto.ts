import { PlatformEnum } from '@addy/common';
import {
  INotificationBatch,
  INotificationBatchRecipient,
  INotificationBatchRequest,
} from '@modules/notifications/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { randomUUID } from 'node:crypto';
import { NotificationRequestPayloadDTO } from '../dto';

class NotificationBatchRequestUserDTO {
  @ApiProperty({
    type: String,
    description:
      'Площадка, на которую надо отправить уведомление.' +
      '<br>' +
      'Если не передано, будет отправлено на все платформы, к которым подключен пользователь',
    enum: PlatformEnum,
    required: false,
    example: PlatformEnum.TELEGRAM,
  })
  @IsOptional()
  @IsString({ message: 'platform must be a string' })
  @IsIn(Object.values(PlatformEnum).filter((p) => p !== 'unknown'))
  platform?: PlatformEnum;

  @ApiProperty({
    type: NotificationRequestPayloadDTO,
    description: 'Данные сообщения',
    required: true,
  })
  @IsOptional()
  @IsObject({ message: 'payload must be an object' })
  @ValidateNested()
  @Type(() => NotificationRequestPayloadDTO)
  payload?: NotificationRequestPayloadDTO;

  @ApiProperty({
    type: Number,
    description: 'ID пользователя',
    required: true,
    example: 1,
  })
  @IsNotEmpty({ message: 'user_id is required' })
  @Type(() => Number)
  @IsInt({ message: 'user_id must be a number' })
  user_id: number;
}

export class NotificationBatchRequestDTO {
  @ApiProperty({
    type: NotificationRequestPayloadDTO,
    description: 'Если передано, то будет отправлено всем пользователям',
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'Payload must be an object' })
  @ValidateNested()
  @Type(() => NotificationRequestPayloadDTO)
  default_payload?: NotificationRequestPayloadDTO;

  @ApiProperty({
    type: NotificationBatchRequestUserDTO,
    isArray: true,
    description: '',
    required: true,
  })
  @IsNotEmpty({ message: 'users is required' })
  @IsArray({ message: 'users must be an array' })
  @ValidateNested()
  @Type(() => NotificationBatchRequestUserDTO)
  recipients: NotificationBatchRequestUserDTO[];

  @ApiProperty({
    type: String,
    description: 'ID уведомления',
    required: true,
    example: randomUUID(),
  })
  @IsNotEmpty({ message: 'notification_id is required' })
  @IsString({ message: 'notification_id must be a string' })
  notification_id: string;
}
