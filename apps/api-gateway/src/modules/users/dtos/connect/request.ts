import { PlatformEnum } from '@addy/common';
import { HasVkId } from '@modules/vk/validators';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';

export class UserConnectRequestDTO {
  @ApiProperty({
    type: String,
    description: 'Платформа для подключения',
    enum: PlatformEnum,
    required: true,
    example: PlatformEnum.VK,
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(PlatformEnum).filter((p) => p !== PlatformEnum.UNKNOWN))
  platform: PlatformEnum;

  @ApiProperty({
    type: String,
    description: 'ID пользователя в системе',
    required: true,
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({
    type: String,
    description: `Обязательно при platform=${PlatformEnum.VK}`,
    required: false,
    example: '12334',
  })
  @IsOptional()
  @IsString()
  @HasVkId()
  platform_user_id?: string;
}
