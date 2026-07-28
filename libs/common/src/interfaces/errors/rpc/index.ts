import { ErrorCodeEnum } from '@src/enums';

export interface IRpcError {
  statusCode: number;
  message: string;
  code: ErrorCodeEnum;
}
