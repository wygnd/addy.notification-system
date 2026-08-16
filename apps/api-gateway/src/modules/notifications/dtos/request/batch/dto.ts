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
import { NotificationRequestPayloadDTO } from '../dto';

class NotificationBatchRequestUserDTO implements INotificationBatchRecipient {
  @ApiProperty({
    type: String,
    description:
      'Площадка, на которую надо отправить уведомление.' + '<br>' +
	    'Если не передано, будет отправлено на все платформы, к которым подключен пользователь',
    enum: PlatformEnum,
    required: false,
    example: PlatformEnum.TELEGRAM,
  })
  @IsOptional()
  @IsString({ message: 'Platform must be a string' })
  @IsIn(Object.values(PlatformEnum).filter((p) => p !== 'unknown'))
  platform?: PlatformEnum;

  @ApiProperty({
    type: NotificationRequestPayloadDTO,
    description: 'Данные сообщения',
    required: true,
  })
  @IsOptional()
  @IsObject({ message: 'Payload must be an object' })
  @ValidateNested()
  @Type(() => NotificationRequestPayloadDTO)
  payload?: NotificationRequestPayloadDTO;

  @ApiProperty({
    type: Number,
    description: 'ID пользователя',
    required: true,
    example: 1,
  })
  @IsNotEmpty({ message: 'UserId is required' })
  @Type(() => Number)
  @IsInt({ message: 'UserId must be a number' })
  userId: string;
}

export class NotificationBatchRequestDTO implements INotificationBatchRequest {
  @ApiProperty({
    type: NotificationRequestPayloadDTO,
    description: 'Если передано, то будет отправлено всем пользователям',
    required: false,
  })
  @IsOptional()
  @IsObject({ message: 'Payload must be an object' })
  @ValidateNested()
  @Type(() => NotificationRequestPayloadDTO)
  defaultPayload: NotificationRequestPayloadDTO;

  @ApiProperty({
    type: NotificationBatchRequestUserDTO,
    isArray: true,
    description: '',
    required: true,
  })
  @IsNotEmpty({ message: 'Users is required' })
  @IsArray({ message: 'Users must be an array' })
  @ValidateNested()
  @Type(() => NotificationBatchRequestUserDTO)
  recipients: NotificationBatchRequestUserDTO[];
}
