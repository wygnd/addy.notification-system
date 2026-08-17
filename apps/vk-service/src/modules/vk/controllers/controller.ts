import {
  IVkEventEmitMap,
  IVkSendMessageMap,
  VkEmitPatternEnum,
  VkSendPatternEnum,
} from '@addy/common';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { VkService } from '../services/service';

@Controller()
export class VkController {
  constructor(private readonly vkBotService: VkService) {}

  @MessagePattern(VkEmitPatternEnum.SEND_MESSAGE)
  public async sendMessage(
    @Payload() data: IVkEventEmitMap[VkEmitPatternEnum.SEND_MESSAGE],
    @Ctx() context: RmqContext,
  ) {
    return this.vkBotService.handleSendNotification(context, data);
  }

  @MessagePattern(VkSendPatternEnum.IS_CLIENT_MEMBER)
  public async checkUserInGroup(
    @Payload()
    data: IVkSendMessageMap[VkSendPatternEnum.IS_CLIENT_MEMBER],
    @Ctx() context: RmqContext,
  ) {
    return this.vkBotService.handleCheckUserInGroup(context, data);
  }
}
