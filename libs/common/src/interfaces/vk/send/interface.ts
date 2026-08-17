import { VkSendPatternEnum } from '@src/enums';

export interface IVkSendMessageMap {
  [VkSendPatternEnum.IS_CLIENT_MEMBER]: VkSendIsClientMemberPayload;
  [VkSendPatternEnum.IS_ALLOW_SEND_MESSAGE]: VkSendIsAllowSendMessagePayload;
}

export interface IVkSendMessageResponseMap {
  [VkSendPatternEnum.IS_CLIENT_MEMBER]: VkSendIsClientMemberResponse;
  [VkSendPatternEnum.IS_ALLOW_SEND_MESSAGE]: VkSendIsAllowSendMessageResponse;
}

export interface VkSendIsClientMemberPayload {
  userId: string;
}

export interface VkSendIsClientMemberResponse {
  status: boolean;
  message: string;
}

export interface VkSendIsAllowSendMessagePayload {
  platformUserId: string;
}

export interface VkSendIsAllowSendMessageResponse {
  status: boolean;
}
