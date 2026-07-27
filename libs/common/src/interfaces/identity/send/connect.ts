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

export interface IIdentityMessageSendConnectResponseBase {
  status: boolean;
  message: string;
}

export interface IIdentityMessageSendConnectResponseTelegram extends IIdentityMessageSendConnectResponseBase {
  platform: PlatformEnum.TELEGRAM;
  code?: string;
}

export interface IIdentityMessageSendConnectResponseVK extends IIdentityMessageSendConnectResponseBase {
  platform: PlatformEnum.VK;
}

export interface IIdentityMessageSendConnectResponseMax extends IIdentityMessageSendConnectResponseBase {
  platform: PlatformEnum.MAX;
}

export interface IIdentityMessageSendConnectResponseUnknown extends IIdentityMessageSendConnectResponseBase {
  platform: PlatformEnum.UNKNOWN;
}

export type IIdentityMessageSendConnectResponse =
  | IIdentityMessageSendConnectResponseTelegram
  | IIdentityMessageSendConnectResponseVK
  | IIdentityMessageSendConnectResponseMax
  | IIdentityMessageSendConnectResponseUnknown;

// ============= CHECK CONNECT =============
export interface IIdentityMessageCheckConnectPayload {
  userId: string;
  platform: PlatformEnum;
}

export interface IIdentityMessageCheckConnectResponse {
  status: boolean;
  clientId: string;
}

// ============= VERIFY CONNECT =============
export interface IIdentityMessageVerifyConnectPayload {
  platformUserId: string;
  platform: PlatformEnum;
  code: string;
}

export interface IIdentityMessageVerifyConnectResponse {
  status: boolean;
  message: string;
}

// ============= DISCONNECT =============
export interface IIdentityMessageDisconnectPayload {
  platform: PlatformEnum;
  platformUserId: string;
}

export interface IIdentityMessageDisconnectResponse {
  status: boolean;
  message: string;
}
