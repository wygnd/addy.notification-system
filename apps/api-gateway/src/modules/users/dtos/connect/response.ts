import { PlatformEnum } from '@addy/common';
import { ApiProperty } from '@nestjs/swagger';

export class UserConnectResponseDTO {
  @ApiProperty({
    type: String,
    description: 'Одноразовый код для подключения',
    required: true,
    example: 'XXX-YYY',
  })
  code: string;

  @ApiProperty({
    type: String,
    description: `Ссылка для подключения. Актуальна для platform=${PlatformEnum.TELEGRAM}`,
    required: false,
  })
  connection_link: string | undefined;
}
