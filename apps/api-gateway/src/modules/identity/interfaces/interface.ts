import { IdentityPatternEnum } from '@modules/identity/enums';
import { PlatformEnum } from '@shared/interfaces';

export interface IIdentityMessageMap {
  [IdentityPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectPayloadFields;
  [IdentityPatternEnum.CHECK_CONNECT]: IIdentityMessageCheckConnectionPayload;
}

export interface IIdentityMessageResponseMap {
  [IdentityPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectResponse;
  [IdentityPatternEnum.CHECK_CONNECT]: IIdentityMessageCheckConnectionResponse;
}

// ============= SEND CONNECT =============
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

type IIdentityMessageSendConnectPayloadFields =
  | IIdentityMessageSendConnectPayloadVk
  | IIdentityMessageSendConnectPayloadTelegram
  | IIdentityMessageSendConnectPayloadMax
  | IIdentityMessageSendConnectPayloadUnknown;

export interface IIdentityMessageSendConnectResponse {
  code?: number;
  message: string;
}

// ============= CHECK CONNECT =============
interface IIdentityMessageCheckConnectionPayload {
  userId: string;
  platform: PlatformEnum;
}

export interface IIdentityMessageCheckConnectionResponse {
  status: boolean;
  clientId: string;
}
