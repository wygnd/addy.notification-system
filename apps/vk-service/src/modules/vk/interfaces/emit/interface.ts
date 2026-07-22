import { VkPatternEnum } from '@modules/vk/enums';
import { PlatformEnum } from '@shared/interfaces';

export interface IVkEventEmitMap {
  [VkPatternEnum.SEND_MESSAGE]: VkSendMessagePayload;
  [VkPatternEnum.SEND_CONNECT_CLIENT]: VkSendConnectClientPayload;
  [VkPatternEnum.SEND_CHECK_CLIENT_IN_GROUP]: VkCheckClientInGroupPayload;
}

export interface VkSendMessagePayload {
  userId: number;
  text: string;
  correlationId: string;
}

export interface VkSendConnectClientPayload {
  platform: PlatformEnum;
  userId: string;
}

export interface VkCheckClientInGroupPayload {
  userId: string;
}
