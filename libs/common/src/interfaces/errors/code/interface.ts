import { HttpStatus } from '@nestjs/common';
import { ErrorCodeEnum } from '@src/enums';

export interface IErrorCodeEntry {
  status: HttpStatus;
  message: string;
}

export interface IAppErrorException {
  code: ErrorCodeEnum;
  message: string;
  details?: unknown;
}

export interface IAppRpcException {
  code: ErrorCodeEnum;
  statusCode: HttpStatus;
  message: string;
}
