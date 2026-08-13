import {
  IdentitySendPatternEnum,
  IIdentityMessageCheckConnectPayload,
  IIdentityMessageGetConnectedPlatformsPayload,
  IIdentityMessageGetUserConnectionPayload,
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

  public async getClientConnections(
    fields: IIdentityMessageGetUserConnectionPayload,
  ) {
    return this.identityProvider.send(
      IdentitySendPatternEnum.GET_USER_CONNECTIONS,
      fields,
    );
  }

  public async getConnectedPlatforms(
    fields: IIdentityMessageGetConnectedPlatformsPayload,
  ) {
    return this.identityProvider.send(
      IdentitySendPatternEnum.GET_CONNECTED_PLATFORMS,
      fields,
    );
  }
}
