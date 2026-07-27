import { IdentitySendPatternEnum } from '@src/enums';
import {
  IIdentityMessageCheckConnectPayload,
  IIdentityMessageCheckConnectResponse,
  IIdentityMessageDisconnectPayload,
  IIdentityMessageDisconnectResponse,
  IIdentityMessageSendConnectPayloadFields,
  IIdentityMessageSendConnectResponse,
  IIdentityMessageVerifyConnectPayload,
  IIdentityMessageVerifyConnectResponse,
} from './connect';
import {
  IIdentityMessageExistsClientPlatformPayload,
  IIdentityMessageExistsClientPlatformResponse,
} from './exists';

export interface IIdentitySendMessageMap {
  [IdentitySendPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectPayloadFields;
  [IdentitySendPatternEnum.VERIFY_CONNECT]: IIdentityMessageVerifyConnectPayload;
  [IdentitySendPatternEnum.CHECK_CONNECT]: IIdentityMessageCheckConnectPayload;
  [IdentitySendPatternEnum.EXISTS_CLIENT_PLATFORM]: IIdentityMessageExistsClientPlatformPayload;
  [IdentitySendPatternEnum.DISCONNECT]: IIdentityMessageDisconnectPayload;
}

export interface IIdentitySendMessageResponseMap {
  [IdentitySendPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectResponse;
  [IdentitySendPatternEnum.VERIFY_CONNECT]: IIdentityMessageVerifyConnectResponse;
  [IdentitySendPatternEnum.CHECK_CONNECT]: IIdentityMessageCheckConnectResponse;
  [IdentitySendPatternEnum.EXISTS_CLIENT_PLATFORM]: IIdentityMessageExistsClientPlatformResponse;
  [IdentitySendPatternEnum.DISCONNECT]: IIdentityMessageDisconnectResponse;
}
