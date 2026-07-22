import { VkPatternEnum } from '@modules/vk/enums';

interface VkSendMessagePayload {
  userId: number;
  text: string;
  correlationId: string;
}

export interface IVkEventEmitMap {
  [VkPatternEnum.SEND_MESSAGE]: VkSendMessagePayload;
}
