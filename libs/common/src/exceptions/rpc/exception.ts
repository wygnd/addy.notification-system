import { RpcException } from '@nestjs/microservices';
import { ErrorCodeEnum } from '@src/enums';
import { ERROR_CODE } from '@src/mappers';

export class AppRpcException extends RpcException {
  constructor(code: ErrorCodeEnum, message?: string) {
    const entry = ERROR_CODE[code];

    super({
      code: code,
      statusCode: entry.status,
      message: message ?? entry.message,
    });
  }
}
