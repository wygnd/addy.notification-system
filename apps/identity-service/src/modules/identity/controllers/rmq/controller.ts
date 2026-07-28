import { IdentitySendPatternEnum, IIdentitySendMessageMap } from '@addy/common';
import { IdentityService } from '@modules/identity/services/service';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class IdentityRMQController {
  constructor(private readonly identityService: IdentityService) {}

  @MessagePattern(IdentitySendPatternEnum.SEND_CONNECT)
  public async connectClient(
    @Payload()
    data: IIdentitySendMessageMap[IdentitySendPatternEnum.SEND_CONNECT],
    @Ctx() context: RmqContext,
  ) {
    return this.identityService.handleConnectClient(context, data);
  }

  @MessagePattern(IdentitySendPatternEnum.CHECK_CONNECT)
  public async checkClientConnection(
    @Payload()
    data: IIdentitySendMessageMap[IdentitySendPatternEnum.CHECK_CONNECT],
    @Ctx() context: RmqContext,
  ) {
    return this.identityService.handleCheckClientConnection(context, data);
  }

  @MessagePattern(IdentitySendPatternEnum.EXISTS_CLIENT_PLATFORM)
  public async checkClientPlatformExists(
    @Payload()
    data: IIdentitySendMessageMap[IdentitySendPatternEnum.EXISTS_CLIENT_PLATFORM],
    @Ctx() context: RmqContext,
  ) {
    return this.identityService.handleCheckClientPlatformExists(context, data);
  }

  @MessagePattern(IdentitySendPatternEnum.VERIFY_CONNECT)
  public async verifyClientConnection(
    @Payload()
    data: IIdentitySendMessageMap[IdentitySendPatternEnum.VERIFY_CONNECT],
    @Ctx() context: RmqContext,
  ) {
    return this.identityService.handleVerifyClientConnection(context, data);
  }

  @MessagePattern(IdentitySendPatternEnum.CONFIRM_CONNECT)
  public async confirmClientConnection(
    @Payload()
    data: IIdentitySendMessageMap[IdentitySendPatternEnum.CONFIRM_CONNECT],
    @Ctx() context: RmqContext,
  ) {
    return this.identityService.handleConfirmClientConnection(context, data);
  }

  @MessagePattern(IdentitySendPatternEnum.DISCONNECT)
  public async disconnectClientAccount(
    @Payload()
    data: IIdentitySendMessageMap[IdentitySendPatternEnum.DISCONNECT],
    @Ctx() context: RmqContext,
  ) {
    return this.identityService.handleDisconnectAccount(context, data);
  }
}
