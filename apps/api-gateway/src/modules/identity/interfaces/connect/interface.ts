import { PlatformEnum } from '@shared/interfaces';

export interface IIdentityConnectClient {
  platform: PlatformEnum;
  userId: string;
}
