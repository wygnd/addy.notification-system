import { PlatformEnum } from '@addy/common';
import { type INotificationRequestPayload } from '@modules/notifications/interfaces/request/interface';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { randomUUID } from 'node:crypto';

export class NotificationRequestPayloadDTO implements INotificationRequestPayload {
  @ApiProperty({
    type: String,
    description: 'Текст сообщения',
    required: true,
    example: 'Привет, мир!',
  })
  @IsNotEmpty({ message: 'text is required' })
  @IsString({ message: 'text must be a string' })
  text: string;
}

export class NotificationRequestDTO {
  @ApiProperty({
    type: String,
    description: 'Площадка, на которую надо отправить уведомление',
    enum: PlatformEnum,
    required: true,
    example: PlatformEnum.TELEGRAM,
  })
  @IsNotEmpty({ message: 'platform is required' })
  @IsString({ message: 'platform must be a string' })
  @IsIn(Object.values(PlatformEnum).filter((p) => p !== 'unknown'))
  platform: PlatformEnum;

  @ApiProperty({
    type: NotificationRequestPayloadDTO,
    description: 'Данные сообщения',
    required: true,
  })
  @IsNotEmpty({ message: 'payload is required' })
  @IsObject({ message: 'payload must be an object' })
  @ValidateNested()
  @Type(() => NotificationRequestPayloadDTO)
  payload: INotificationRequestPayload;

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
