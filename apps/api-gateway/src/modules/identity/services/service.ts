import { Injectable } from '@nestjs/common';
import { IdentityProvider } from '@modules/identity/providers/provider';
import { IdentityPatternEnum } from '@modules/identity/enums';
import { IIdentityConnectClient } from '@modules/identity/interfaces';

@Injectable()
export class IdentityService {
  constructor(private readonly identityProvider: IdentityProvider) {}

  public async connectClient(fields: IIdentityConnectClient) {
    return this.identityProvider.send(IdentityPatternEnum.SEND_CONNECT, {
      userId: fields.userId,
      platform: fields.platform,
    });
  }
}
