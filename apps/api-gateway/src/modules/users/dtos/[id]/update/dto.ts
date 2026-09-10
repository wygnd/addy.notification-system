import { TIdentityUpdateFields } from '@addy/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserRequestDTO implements TIdentityUpdateFields {
  @ApiProperty({
    type: Boolean,
    description: 'Активна ли подписка на уведомления',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
