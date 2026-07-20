import {
  INotificationRequest,
  type INotificationRequestPayload,
} from '@modules/notifications/interfaces/request/interface';
import { PlatformEnum } from '@shared/interfaces';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

export class NotificationRequestDTO implements INotificationRequest {
  @IsNotEmpty({ message: 'Platform is required' })
  @IsString({ message: 'Platform must be a string' })
  @IsIn(Object.values(PlatformEnum).filter((p) => p !== 'unknown'))
  platform: PlatformEnum;

  @ApiProperty({
    type: NotificationRequestPayloadDTO,
    description: 'Данные сообщения',
    required: true,
  })
  @IsNotEmpty({ message: 'Payload is required' })
  @IsObject({ message: 'Payload must be an object' })
  @ValidateNested()
  @Type(() => NotificationRequestPayloadDTO)
  payload: INotificationRequestPayload;

  @ApiProperty({
    type: Number,
    description: 'ID пользователя',
    required: true,
    example: 1,
  })
  @IsNotEmpty({ message: 'UserId is required' })
  @Type(() => Number)
  @IsInt({ message: 'UserId must be a number' })
  userId: number;
}
