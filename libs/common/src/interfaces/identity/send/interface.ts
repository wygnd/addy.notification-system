import { IdentitySendPatternEnum } from '@src/enums';
import {
  IIdentityMessageCheckConnectPayload,
  IIdentityMessageCheckConnectResponse,
  IIdentityMessageSendConnectPayloadFields,
  IIdentityMessageSendConnectResponse,
} from './connect';
import {
  IIdentityMessageExistsClientPlatformPayload,
  IIdentityMessageExistsClientPlatformResponse,
} from './exists';

export interface IIdentitySendMessageMap {
  [IdentitySendPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectPayloadFields;
  [IdentitySendPatternEnum.CHECK_CONNECT]: IIdentityMessageCheckConnectPayload;
  [IdentitySendPatternEnum.EXISTS_CLIENT_PLATFORM]: IIdentityMessageExistsClientPlatformPayload;
}

export interface IIdentitySendMessageResponseMap {
  [IdentitySendPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectResponse;
  [IdentitySendPatternEnum.CHECK_CONNECT]: IIdentityMessageCheckConnectResponse;
  [IdentitySendPatternEnum.EXISTS_CLIENT_PLATFORM]: IIdentityMessageExistsClientPlatformResponse;
}
