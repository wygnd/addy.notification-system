import { PlatformEnum } from '@addy/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UserDisconnectQueryRequestDTO {
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
}
