import { IdentitySendPatternEnum } from '@src/enums';
import {
  IIdentityMessageCheckConnectPayload,
  IIdentityMessageCheckConnectResponse,
  IIdentityMessageDisconnectPayload,
  IIdentityMessageDisconnectResponse,
  IIdentityMessageGetConnectedPlatformsPayload,
  IIdentityMessageGetConnectedPlatformsResponse,
  IIdentityMessageGetUserConnectionPayload,
  IIdentityMessageGetUserConnectionResponse,
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
  [IdentitySendPatternEnum.CONFIRM_CONNECT]: IIdentityMessageVerifyConnectPayload;
  [IdentitySendPatternEnum.CHECK_CONNECT]: IIdentityMessageCheckConnectPayload;
  [IdentitySendPatternEnum.EXISTS_CLIENT_PLATFORM]: IIdentityMessageExistsClientPlatformPayload;
  [IdentitySendPatternEnum.DISCONNECT]: IIdentityMessageDisconnectPayload;
  [IdentitySendPatternEnum.GET_USER_CONNECTIONS]: IIdentityMessageGetUserConnectionPayload;
  [IdentitySendPatternEnum.GET_CONNECTED_PLATFORMS]: IIdentityMessageGetConnectedPlatformsPayload;
}

export interface IIdentitySendMessageResponseMap {
  [IdentitySendPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectResponse;
  [IdentitySendPatternEnum.VERIFY_CONNECT]: IIdentityMessageVerifyConnectResponse;
  [IdentitySendPatternEnum.CONFIRM_CONNECT]: IIdentityMessageVerifyConnectResponse;
  [IdentitySendPatternEnum.CHECK_CONNECT]: IIdentityMessageCheckConnectResponse;
  [IdentitySendPatternEnum.EXISTS_CLIENT_PLATFORM]: IIdentityMessageExistsClientPlatformResponse;
  [IdentitySendPatternEnum.DISCONNECT]: IIdentityMessageDisconnectResponse;
  [IdentitySendPatternEnum.GET_USER_CONNECTIONS]: IIdentityMessageGetUserConnectionResponse;
  [IdentitySendPatternEnum.GET_CONNECTED_PLATFORMS]: IIdentityMessageGetConnectedPlatformsResponse;
}
