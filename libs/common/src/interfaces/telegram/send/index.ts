import { TelegramSendPatternEnum } from '@src/enums';

export interface ITelegramSendMessageMap {
  [TelegramSendPatternEnum.HEALTH]: ITelegramHealthPayload;
}

export interface ITelegramSendMessageResponseMap {
  [TelegramSendPatternEnum.HEALTH]: ITelegramHealthResponse;
}

export interface ITelegramHealthPayload {}

export interface ITelegramHealthResponse {
  ok: boolean;
  bot: boolean;
  redis: boolean;
}
