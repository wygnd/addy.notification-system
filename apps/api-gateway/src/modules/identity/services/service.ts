import {
  IdentitySendPatternEnum,
  IIdentityMessageCheckConnectPayload,
  IIdentityMessageSendConnectPayloadFields,
} from '@addy/common';
import { IdentityProvider } from '@modules/identity/providers/provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IdentityService {
  constructor(private readonly identityProvider: IdentityProvider) {}

  public async connectClient(fields: IIdentityMessageSendConnectPayloadFields) {
    return this.identityProvider.send(
      IdentitySendPatternEnum.SEND_CONNECT,
      fields,
    );
  }

  public async checkClientConnection(
    fields: IIdentityMessageCheckConnectPayload,
  ) {
    return this.identityProvider.send(
      IdentitySendPatternEnum.CHECK_CONNECT,
      fields,
    );
  }

  public async getClientConnection(userId: string) {}
}
