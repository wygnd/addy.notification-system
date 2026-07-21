import { VkPattern } from '@modules/vk/enums';

interface VkSendMessagePayload {
  userId: number;
  text: string;
}

export interface IVkEventEmitMap {
  [VkPattern.SEND_MESSAGE]: VkSendMessagePayload;
}
