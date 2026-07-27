import { TelegramEmitPatternEnum } from '@src/enums';

export interface ITelegramEventEmitMap {
  [TelegramEmitPatternEnum.SEND_MESSAGE]: ITelegramSendMessagePayload;
}

export interface ITelegramSendMessagePayload {
  userId: string;
  text: string;
  correlationId: string;
}
