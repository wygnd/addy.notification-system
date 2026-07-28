import { ErrorCodeEnum } from '@src/enums';

export interface INormalizeError {
  statusCode: number;
  code: ErrorCodeEnum;
  message: string;
}
