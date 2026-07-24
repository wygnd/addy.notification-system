import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { IdentityService } from '@modules/identity/services/service';
import { IdentityPatternEnum } from '@modules/identity/enums';
import {
  IIdentityMessageCheckConnectPayload,
  IIdentityMessageMap,
} from '@modules/identity/interfaces';

@Controller()
export class IdentityRMQController {
  constructor(private readonly identityService: IdentityService) {}

  @MessagePattern(IdentityPatternEnum.SEND_CONNECT)
  public async connectClient(
    @Payload() data: IIdentityMessageMap[IdentityPatternEnum.SEND_CONNECT],
    @Ctx() context: RmqContext,
  ) {
    return this.identityService.handleConnectClient(context, data);
  }

  @MessagePattern(IdentityPatternEnum.CHECK_CONNECT)
  public async checkClientConnection(
    @Payload() data: IIdentityMessageMap[IdentityPatternEnum.CHECK_CONNECT],
    @Ctx() context: RmqContext,
  ) {
    return this.identityService.handleCheckClientConnection(context, data);
  }
}
