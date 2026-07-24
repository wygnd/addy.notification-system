import { PlatformEnum, VkSendPatternEnum } from '@src/enums';

export interface IVkSendMessageMap {
  [VkSendPatternEnum.SEND_CHECK_CLIENT_IN_GROUP]: VkCheckClientInGroupPayload;
  [VkSendPatternEnum.SEND_CONNECT_CLIENT]: VkSendConnectClientPayload;
}

export interface IVkSendMessageResponseMap {
  [VkSendPatternEnum.SEND_CHECK_CLIENT_IN_GROUP]: VkCheckClientInGroupResponse;
}

export interface VkCheckClientInGroupPayload {
  userId: string;
}

export interface VkCheckClientInGroupResponse {
  status: boolean;
  message: string;
}

export interface VkSendConnectClientPayload {
  platform: PlatformEnum;
  userId: string;
}
