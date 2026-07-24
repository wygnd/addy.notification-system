import { PlatformEnum } from '@addy/common';

export interface IUserConnectBase {
  userId: string;
}

export interface IUserConnectVk extends IUserConnectBase {
  platform: PlatformEnum.VK;
  platformUserId: string;
}

export interface IUserConnectTelegram extends IUserConnectBase {
  platform: PlatformEnum.TELEGRAM;
}

export interface IUserConnectMax extends IUserConnectBase {
  platform: PlatformEnum.MAX;
}

export interface IUserConnectUnknown extends IUserConnectBase {
  platform: PlatformEnum.UNKNOWN;
}

export type IUserConnectFields =
  IUserConnectVk | IUserConnectTelegram | IUserConnectMax | IUserConnectUnknown;
