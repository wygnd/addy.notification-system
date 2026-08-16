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
  [ErrorCodeEnum.USER_WAS_CONNECTING_TO_PLATFORM]: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Пользователь уже подключен к площадке',
  },
  [ErrorCodeEnum.USER_BLOCK_SEND_MESSAGE]: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Пользователь заблокировал отправку сообщений',
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
  [ErrorCodeEnum.NOTIFICATION_WAS_RECEIVED]: {
    status: HttpStatus.CONFLICT,
    message: 'Уведомление было получено',
  },
  [ErrorCodeEnum.NOTIFICATION_INVALID_PAYLOAD]: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Invalid payload',
  },

  /* ======================= SERVICE EXCEPTIONS ======================= */
  [ErrorCodeEnum.SERVICE_TIMEOUT]: {
    status: HttpStatus.GATEWAY_TIMEOUT,
    message: 'Сервис не отвечает',
  },
  [ErrorCodeEnum.SERVICE_BAD_REQUEST]: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Внутренняя ошибка сервера',
  },

  /* ======================= IDENTITY EXCEPTIONS ======================= */
  [ErrorCodeEnum.IDENTITY_ACCOUNT_NOT_CONNECTED]: {
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Аккаунт не подключен',
  },

  /* ======================= GENERAL ======================= */
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
  [ErrorCodeEnum.NOT_ALLOWED]: {
    status: HttpStatus.METHOD_NOT_ALLOWED,
    message: 'Метод недоступен',
  },
};
