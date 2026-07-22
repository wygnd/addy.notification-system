import { VkEmitPatternEnum, VkSendPatternEnum } from '@modules/vk/enums';

export interface IVkEventEmitMap {
  [VkEmitPatternEnum.SEND_MESSAGE]: VkSendMessagePayload;
}

export interface IVkSendMessageMap {
  [VkSendPatternEnum.SEND_CHECK_CLIENT_IN_GROUP]: VkCheckClientInGroupPayload;
}

export interface IVkSendMessageResponseMap {
  [VkSendPatternEnum.SEND_CHECK_CLIENT_IN_GROUP]: VkCheckClientInGroupResponse;
}

interface VkSendMessagePayload {
  userId: number;
  text: string;
  correlationId: string;
}

interface VkCheckClientInGroupPayload {
  userId: string;
}

interface VkCheckClientInGroupResponse {
  status: boolean;
  message: string;
}
