import { HttpException } from '@nestjs/common';
import { ErrorCodeEnum } from '@src/enums';
import { ERROR_CODE } from '@src/mappers';

export class AppException extends HttpException {
  public readonly code: ErrorCodeEnum;

  constructor(code: ErrorCodeEnum, message?: string, details?: unknown) {
    const entry = ERROR_CODE[code];

    super(
      {
        code: code,
        message: message ?? entry.message,
        details: details,
      },
      entry.status,
    );

    this.code = code;
  }
}
