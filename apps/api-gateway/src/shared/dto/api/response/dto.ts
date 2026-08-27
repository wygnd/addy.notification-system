import { ERROR_CODE, ErrorCodeEnum } from '@addy/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiOkResponseDTO<T = unknown> {
  @ApiProperty({
    type: Boolean,
    description: 'Статус ответа',
    example: true,
  })
  ok: true;

  @ApiProperty({
    type: Object,
    description: 'Возвращаемые данные',
  })
  data: T;

  @ApiProperty({
    type: String,
    description: 'Время запроса',
    example: new Date().toISOString(),
  })
  timestamp: string;
}

export class ApiErrorResponseDTO<T = unknown> {
  @ApiProperty({
    type: Boolean,
    description: 'Статус ответа',
    example: false,
  })
  ok: false;

  @ApiProperty({
    type: String,
    description: 'Код ошибки',
    example: ErrorCodeEnum.VALIDATION_ERROR,
  })
  err_code: string;

  @ApiProperty({
    type: String,
    description: 'Сообщение ошибки',
    example: ERROR_CODE[ErrorCodeEnum.VALIDATION_ERROR].message,
  })
  err_detail: string;

  @ApiProperty({
    type: String,
    description: 'Время запроса',
    example: new Date().toISOString(),
  })
  timestamp: string;
}
