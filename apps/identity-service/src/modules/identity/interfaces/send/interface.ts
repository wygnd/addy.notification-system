import { PlatformEnum } from '@shared/enums';
import { IdentityPatternEnum } from '@modules/identity/enums';

export interface IIdentityMessageMap {
  [IdentityPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectPayload;
}

export interface IIdentityMessageResponseMap {
  [IdentityPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectResponse;
}

export interface IIdentityMessageSendConnectPayload {
  userId: string;
  platform: PlatformEnum;
}

export interface IIdentityMessageSendConnectResponse {
  code?: number;
  message: string;
}
