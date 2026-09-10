import { IdentitySendPatternEnum } from '@src/enums';
import {
  IIdentityMessageClientUpdatePayload,
  IIdentityMessageClientUpdateResponse,
} from './client';
import {
  IIdentityMessageCheckConnectPayload,
  IIdentityMessageCheckConnectResponse,
  IIdentityMessageDisconnectByIdPayload,
  IIdentityMessageDisconnectByIdResponse,
  IIdentityMessageDisconnectPayload,
  IIdentityMessageDisconnectResponse,
  IIdentityMessageExistsClientPlatformPayload,
  IIdentityMessageExistsClientPlatformResponse,
  IIdentityMessageGetConnectedPlatformsPayload,
  IIdentityMessageGetConnectedPlatformsResponse,
  IIdentityMessageGetUserConnectionPayload,
  IIdentityMessageGetUserConnectionResponse,
  IIdentityMessageSendConnectPayloadFields,
  IIdentityMessageSendConnectResponse,
  IIdentityMessageVerifyConnectPayload,
  IIdentityMessageVerifyConnectResponse,
} from './connection';
import {
  IIdentityMessageHealthPayload,
  IIdentityMessageHealthResponse,
} from './health';

export interface IIdentitySendMessageMap {
  [IdentitySendPatternEnum.SEND_CONNECT]: IIdentityMessageSendConnectPayloadFields;
  [IdentitySendPatternEnum.VERIFY_CONNECT]: IIdentityMessageVerifyConnectPayload;
  [IdentitySendPatternEnum.CONFIRM_CONNECT]: IIdentityMessageVerifyConnectPayload;
  [IdentitySendPatternEnum.CHECK_CONNECT]: IIdentityMessageCheckConnectPayload;
  [IdentitySendPatternEnum.EXISTS_CLIENT_PLATFORM]: IIdentityMessageExistsClientPlatformPayload;
  [IdentitySendPatternEnum.DISCONNECT]: IIdentityMessageDisconnectPayload;
  [IdentitySendPatternEnum.GET_USER_CONNECTIONS]: IIdentityMessageGetUserConnectionPayload;
  [IdentitySendPatternEnum.GET_CONNECTED_PLATFORMS]: IIdentityMessageGetConnectedPlatformsPayload;
  [IdentitySendPatternEnum.SEND_DISCONNECT]: IIdentityMessageDisconnectByIdPayload;
  [IdentitySendPatternEnum.HEALTH]: IIdentityMessageHealthPayload;
  [IdentitySendPatternEnum.UPDATE_CLIENT]: IIdentityMessageClientUpdatePayload;
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
  [IdentitySendPatternEnum.SEND_DISCONNECT]: IIdentityMessageDisconnectByIdResponse;
  [IdentitySendPatternEnum.HEALTH]: IIdentityMessageHealthResponse;
  [IdentitySendPatternEnum.UPDATE_CLIENT]: IIdentityMessageClientUpdateResponse;
}
