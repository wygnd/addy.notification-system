import {
  IIdentityMessageGetUserConnectionItem,
  IIdentityMessageGetUserConnectionResponse,
  PlatformEnum,
} from '@addy/common';
import { ApiProperty } from '@nestjs/swagger';

class UserGetByIdResponseItemDTO implements IIdentityMessageGetUserConnectionItem {
  @ApiProperty({
    type: Boolean,
    description: 'Флаг, указывающий, подключен ли пользователь к платформе',
    required: true,
    example: true,
  })
  connected: boolean;

  @ApiProperty({
    type: String,
    enum: PlatformEnum,
    description: 'Платформа',
    required: true,
    example: PlatformEnum.TELEGRAM,
  })
  platform: PlatformEnum;

  @ApiProperty({
    type: String,
    description:
      'ID пользователя на платформе. Указывается, при connected=true',
    required: false,
    example: '76843578',
  })
  platformUserId: string | null;
}

export class UserGetByIdResponseDTO implements IIdentityMessageGetUserConnectionResponse {
  @ApiProperty({
    type: UserGetByIdResponseItemDTO,
    description: 'Подключенные площадки',
    isArray: true,
    required: true,
  })
  items: UserGetByIdResponseItemDTO[];
}
