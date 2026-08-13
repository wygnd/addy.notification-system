import { HttpException } from '@nestjs/common';
import { ERRNO_CODE_MAP } from '@src/constants';
import { ErrorCodeEnum } from '@src/enums';
import { AppException } from '@src/exceptions';
import { IAppErrorException, INormalizeError } from '@src/interfaces';
import { isVkApiError } from '@src/utils';
import { isAxiosError } from 'axios';
import { isRpcError } from './rpc';

const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  return error instanceof Error && 'code' in error;
};

export const isObjectWithMessage = (
  val: unknown,
): val is { message: string } => {
  return typeof val === 'object' && val !== null && 'message' in val;
};

export const normalizeError = (error: unknown): INormalizeError => {
  // RPC ошибка
  if (isRpcError(error)) {
    return {
      statusCode: error.statusCode ?? 500,
      code: error.code ?? ErrorCodeEnum.INTERNAL_ERROR,
      message: error.message ?? 'RPC ошибка',
    };
  }

  if (error instanceof AppException) {
    const response = error.getResponse() as IAppErrorException;

    return {
      statusCode: error.getStatus(),
      code: error.code,
      message: response.message,
    };
  }

  // Ошибка со стороны NestJS
  if (error instanceof HttpException) {
    const response = error.getResponse();
    const message = isObjectWithMessage(response)
      ? response.message
      : typeof response === 'string'
        ? response
        : error.message;

    return {
      code: ErrorCodeEnum.VALIDATION_ERROR,
      statusCode: error.getStatus(),
      message: Array.isArray(message) ? message[0] : message,
    };
  }

  // Ошибка на стороне axios
  if (isAxiosError(error) && error.response) {
    const data = error.response.data;

    return {
      code: ErrorCodeEnum.INTERNAL_ERROR,
      statusCode: error.response.status,
      message: isObjectWithMessage(data)
        ? data.message
        : typeof data === 'string'
          ? data
          : error.message,
    };
  }

  // Axios нет соединения или таймаут
  if (isAxiosError(error)) {
    return {
      code: ErrorCodeEnum.REQUEST_TIMEOUT,
      statusCode: ['ECONNABORTED', 'ETIMEDOUT'].includes(error.code ?? '')
        ? 504
        : 503,
      message: error.message ?? 'Ошибка соединения',
    };
  }

  if (isVkApiError(error)) {
    return {
      code: ErrorCodeEnum.INTERNAL_ERROR,
      statusCode: error.response.error_code,
      message: error.response.error_msg,
    };
  }

  // NodeJS системные ошибки
  if (isErrnoException(error)) {
    return {
      code: ErrorCodeEnum.INTERNAL_ERROR,
      statusCode: ERRNO_CODE_MAP[error.code ?? ''] ?? 500,
      message: error.message,
    };
  }

  // JS ошибки
  if (error instanceof Error) {
    return {
      code: ErrorCodeEnum.INTERNAL_ERROR,
      statusCode: 500,
      message: error.message,
    };
  }

  if (typeof error === 'string') {
    return {
      code: ErrorCodeEnum.INTERNAL_ERROR,
      statusCode: 500,
      message: error,
    };
  }

  if (typeof error === 'number') {
    return {
      code: ErrorCodeEnum.INTERNAL_ERROR,
      statusCode: 500,
      message: `Код ошибки: ${error}`,
    };
  }

  return {
    code: ErrorCodeEnum.INTERNAL_ERROR,
    statusCode: 500,
    message: 'Непредвиденная ошибка',
  };
};
