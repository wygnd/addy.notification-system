import { HttpException } from '@nestjs/common';
import { ERRNO_CODE_MAP } from '@src/constants';
import { INormalizeError } from '@src/interfaces';
import { isAxiosError } from 'axios';
import { isRpcError } from './rpc';

const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  return error instanceof Error && 'code' in error;
};

const isObjectWithMessage = (val: unknown): val is { message: string } => {
  return typeof val === 'object' && val !== null && 'message' in val;
};

export const normalizeError = (error: unknown): INormalizeError => {
  // RPC ошибка
  if (isRpcError(error)) {
    return {
      code: error.statusCode ?? 500,
      message: error.message ?? 'RPC ошибка',
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
      code: error.getStatus(),
      message: Array.isArray(message) ? message[0] : message,
    };
  }

  // Ошибка на стороне axios
  if (isAxiosError(error) && error.response) {
    const data = error.response.data;

    return {
      code: error.response.status,
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
      code: ['ECONNABORTED', 'ETIMEDOUT'].includes(error.code ?? '')
        ? 504
        : 503,
      message: error.message ?? 'Ошибка соединения',
    };
  }

  // NodeJS системные ошибки
  if (isErrnoException(error)) {
    return {
      code: ERRNO_CODE_MAP[error.code ?? ''] ?? 500,
      message: error.message,
    };
  }

  // JS ошибки
  if (error instanceof Error) {
    return { code: 500, message: error.message };
  }

  if (typeof error === 'string') {
    return { code: 500, message: error };
  }

  if (typeof error === 'number') {
    return { code: 500, message: `Код ошибки: ${error}` };
  }

  return {
    code: 500,
    message: 'Непредвиденная ошибка',
  };
};
