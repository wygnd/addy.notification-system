import { PlatformEnum, VkEmitPatternEnum } from '@src/enums';

export interface IVkEventEmitMap {
  [VkEmitPatternEnum.SEND_MESSAGE]: VkSendMessagePayload;
}

export interface VkSendMessagePayload {
  userId: string;
  text: string;
  correlationId: string;
}
