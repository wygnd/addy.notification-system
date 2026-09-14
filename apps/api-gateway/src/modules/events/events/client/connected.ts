import { PlatformEnum } from '@addy/common';

export class EventClientConnected {
  constructor(
    public readonly userId: number,
    public readonly platform: PlatformEnum,
  ) {}
}
