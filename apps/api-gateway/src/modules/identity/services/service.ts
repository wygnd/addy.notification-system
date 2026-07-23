import { Injectable } from '@nestjs/common';
import { IdentityProvider } from '@modules/identity/providers/provider';
import { IdentityPatternEnum } from '@modules/identity/enums';
import {
  IIdentityClientCheckConnectionFields,
  IIdentityConnectClientFields,
} from '@modules/identity/interfaces';
import { PlatformEnum } from '@shared/interfaces';

@Injectable()
export class IdentityService {
  constructor(private readonly identityProvider: IdentityProvider) {}

  public async connectClient(fields: IIdentityConnectClientFields) {
    return this.identityProvider.send(IdentityPatternEnum.SEND_CONNECT, fields);
  }

  public async checkClientConnection(
    fields: IIdentityClientCheckConnectionFields,
  ) {
    return this.identityProvider.send(
      IdentityPatternEnum.CHECK_CONNECT,
      fields,
    );
  }
}
