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
}
