import { PlatformEnum } from '@shared/interfaces';

export interface IIdentityConnectClientBase {
  userId: string;
}

interface IIdentityConnectClientVk extends IIdentityConnectClientBase {
  platform: PlatformEnum.VK;
  platformUserId: string;
}

interface IIdentityConnectClientTelegram extends IIdentityConnectClientBase {
  platform: PlatformEnum.TELEGRAM;
}

interface IIdentityConnectClientMax extends IIdentityConnectClientBase {
  platform: PlatformEnum.MAX;
}

interface IIdentityConnectClientUnknown extends IIdentityConnectClientBase {
  platform: PlatformEnum.UNKNOWN;
}

export type IIdentityConnectClientFields =
  | IIdentityConnectClientVk
  | IIdentityConnectClientTelegram
  | IIdentityConnectClientMax
  | IIdentityConnectClientUnknown;
