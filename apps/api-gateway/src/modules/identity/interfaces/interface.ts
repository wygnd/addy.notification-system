import { IdentityPatternEnum } from '@modules/identity/enums';
import { PlatformEnum } from '@shared/interfaces';

export interface IIdentityMessageMap {
  [IdentityPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectPayload;
}

export interface IIdentityMessageResponseMap {
  [IdentityPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectResponse;
}

interface IIdentityMessageSendConnectPayload {
  userId: string;
  platform: PlatformEnum;
}

export interface IIdentityMessageSendConnectResponse {
  code?: number;
  message: string;
}