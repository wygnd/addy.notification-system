import { VkEmitPatternEnum } from '@src/enums';

export interface IVkEventEmitMap {
  [VkEmitPatternEnum.SEND_MESSAGE]: IVkSendMessagePayload;
  [VkEmitPatternEnum.SEND_GREETING_MESSAGE]: IVKSendGreetingMessagePayload;
}

export interface IVkSendMessagePayload {
  userId: string;
  text: string;
  correlationId: string;
}

export interface IVKSendGreetingMessagePayload {
  userId: string;
  text: string;
  buttons: any;
}
