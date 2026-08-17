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

export interface IIdentityMessageSendConnectResponse extends IIdentityMessageSendConnectResponseBase {
  platform: PlatformEnum;
  code: string;
  connectionLink?: string;
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

// ============= GET USER CONNECTIONS =============
export interface IIdentityMessageGetUserConnectionPayload {
  userId: string;
}

export interface IIdentityMessageGetUserConnectionItem {
  platform: PlatformEnum;
  connected: boolean;
  platformUserId: string | null;
}

export interface IIdentityMessageGetUserConnectionResponse {
  items: IIdentityMessageGetUserConnectionItem[];
}

// ============= GET_CONNECTED_PLATFORMS =============
export interface IIdentityMessageGetConnectedPlatformsPayload {
  clientIds: string[];
}

export interface IIdentityMessageGetConnectedPlatformsResponse {
  items: Record<string, IIdentityMessageGetUserConnectionItem[]>;
}
