// ============= SEND CONNECT =============
import { PlatformEnum } from '@src/enums';

interface IIdentityMessageSendConnectPayloadBase {
  userId: string;
}

interface IIdentityMessageSendConnectPayloadVk extends IIdentityMessageSendConnectPayloadBase {
  platform: PlatformEnum.VK;
  platformUserId: string;
}

interface IIdentityMessageSendConnectPayloadTelegram extends IIdentityMessageSendConnectPayloadBase {
  platform: PlatformEnum.TELEGRAM;
}

interface IIdentityMessageSendConnectPayloadMax extends IIdentityMessageSendConnectPayloadBase {
  platform: PlatformEnum.MAX;
}

interface IIdentityMessageSendConnectPayloadUnknown extends IIdentityMessageSendConnectPayloadBase {
  platform: PlatformEnum.UNKNOWN;
}

export type IIdentityMessageSendConnectPayloadFields =
  | IIdentityMessageSendConnectPayloadVk
  | IIdentityMessageSendConnectPayloadTelegram
  | IIdentityMessageSendConnectPayloadMax
  | IIdentityMessageSendConnectPayloadUnknown;

export interface IIdentityMessageSendConnectResponse {
  code?: number;
  message: string;
}

// ============= CHECK CONNECT =============
export interface IIdentityMessageCheckConnectPayload {
  userId: string;
  platform: PlatformEnum;
}

export interface IIdentityMessageCheckConnectResponse {
  status: boolean;
  clientId: string;
}
