import { HttpStatus } from '@nestjs/common';
import { ErrorCodeEnum } from '@src/enums';
import { IErrorCodeEntry } from '@src/interfaces';

export const ERROR_CODE: Record<ErrorCodeEnum, IErrorCodeEntry> = {
  /* ======================= USERS ======================= */
  [ErrorCodeEnum.USER_NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: 'Пользователь не найден',
  },
  [ErrorCodeEnum.USER_NOT_VERIFIED]: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    message: 'Пользователь в состоянии подключения',
  },
  [ErrorCodeEnum.USER_WAS_REVOKED]: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    message: 'Пользователь отключен',
  },
  [ErrorCodeEnum.USER_NOT_MATCHED]: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    message: 'Пользователь не подключен',
  },

  /* ======================= NOTIFICATIONS ======================= */
  [ErrorCodeEnum.NOTIFICATION_NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: 'Запись не найдена',
  },
  [ErrorCodeEnum.NOTIFICATION_ID_REQUIRED]: {
    status: HttpStatus.BAD_REQUEST,
    message: 'ID записи обязательна',
  },
  [ErrorCodeEnum.NOTIFICATION_NOT_RETRYABLE]: {
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Невозможно отправить уведомление повторно',
  },
  [ErrorCodeEnum.NOTIFICATION_EMPTY_PAYLOAD]: {
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Не удалось отправить уведомление. Пустые данные',
  },

  /* ======================= GENERAL ======================= */
  [ErrorCodeEnum.SERVICE_TIMEOUT]: {
    status: HttpStatus.GATEWAY_TIMEOUT,
    message: 'Сервис не отвечает',
  },
  [ErrorCodeEnum.INTERNAL_ERROR]: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Непредвиденная ошибка',
  },
  [ErrorCodeEnum.VALIDATION_ERROR]: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Ошибка валидации',
  },
  [ErrorCodeEnum.TOO_MANY_ATTEMPTS]: {
    status: HttpStatus.TOO_MANY_REQUESTS,
    message: 'Слишком много попыток',
  },
  [ErrorCodeEnum.REQUEST_TIMEOUT]: {
    status: HttpStatus.REQUEST_TIMEOUT,
    message: 'Превышено время ожидания ответа',
  },
};
