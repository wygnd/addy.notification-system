import { PlatformEnum } from '@src/enums';

export interface IIdentityMessageExistsClientPlatformPayload {
  platformUserId: string;
  platform: PlatformEnum;
}

export interface IIdentityMessageExistsClientPlatformResponse {
  status: boolean;
  message: string;
}
