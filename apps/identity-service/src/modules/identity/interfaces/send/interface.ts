import { PlatformEnum } from '@shared/enums';
import { IdentityPatternEnum } from '@modules/identity/enums';
import { IdentityDTO } from '@modules/identity/dtos';

export interface IIdentityMessageMap {
  [IdentityPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectPayloadFields;
  [IdentityPatternEnum.CHECK_CONNECT]: IIdentityMessageCheckConnectPayload;
}

export interface IIdentityMessageResponseMap {
  [IdentityPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectResponse;
  [IdentityPatternEnum.CHECK_CONNECT]: IIdentityMessageCheckConnectResponse;
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
