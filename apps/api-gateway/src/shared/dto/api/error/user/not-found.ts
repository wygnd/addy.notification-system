import { ERROR_CODE, ErrorCodeEnum } from '@addy/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiUserNotFoundDTO {
  @ApiProperty({
    type: String,
    example: ERROR_CODE[ErrorCodeEnum.USER_NOT_FOUND],
  })
  declare err_code: string;

  @ApiProperty({
    type: String,
    example: ERROR_CODE[ErrorCodeEnum.USER_NOT_FOUND],
  })
  declare err_detail: string;
}
