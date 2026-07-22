import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { IdentityService } from '@modules/identity/services/service';
import { IdentityPatternEnum } from '@modules/identity/enums';
import { IIdentityMessageMap } from '@modules/identity/interfaces';

@Controller()
export class IdentityRMQController {
  private readonly logger = new Logger(IdentityRMQController.name);

  constructor(private readonly identityService: IdentityService) {}

  @MessagePattern(IdentityPatternEnum.SEND_CONNECT)
  public async connectClient(
    @Payload() data: IIdentityMessageMap[IdentityPatternEnum.SEND_CONNECT],
    @Ctx() context: RmqContext,
  ) {
    return this.identityService.handleConnectClient(context, data);
  }
}
