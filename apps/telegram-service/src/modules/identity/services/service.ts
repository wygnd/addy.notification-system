import { IdentitySendPatternEnum, PlatformEnum } from '@addy/common';
import { IdentityProvider } from '@modules/identity/providers/provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IdentityService {
  constructor(private readonly identityProvider: IdentityProvider) {}

  public async checkClientPlatform(userId: string) {
    return this.identityProvider.send<IdentitySendPatternEnum.EXISTS_CLIENT_PLATFORM>(
      IdentitySendPatternEnum.EXISTS_CLIENT_PLATFORM,
      {
        platformUserId: userId,
        platform: PlatformEnum.TELEGRAM,
      },
    );
  }

  public async verifyCode(userId: string, code: string) {
    return this.identityProvider.send<IdentitySendPatternEnum.VERIFY_CONNECT>(
      IdentitySendPatternEnum.VERIFY_CONNECT,
      {
        platform: PlatformEnum.TELEGRAM,
        platformUserId: userId,
        code: code,
      },
    );
  }
}
