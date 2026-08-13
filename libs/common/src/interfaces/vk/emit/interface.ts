import { VkEmitPatternEnum } from '@src/enums';

export interface IVkEventEmitMap {
  [VkEmitPatternEnum.SEND_MESSAGE]: VkSendMessagePayload;
  [VkEmitPatternEnum.SEND_MESSAGE_BATCH]: VkSendMessageBatchPayload;
}

export interface VkSendMessagePayload {
  userId: string;
  text: string;
  correlationId: string;
}

export interface VkSendMessageBatchPayload {
  text: string;
  correlationId: string;
  userIds: string[];
}
