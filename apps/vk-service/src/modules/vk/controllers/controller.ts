import { Controller } from '@nestjs/common';
import { VkService } from '../services/service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { VkPatternEnum } from '../enums';
import { IVkEventEmitMap } from '../interfaces';

@Controller()
export class VkController {
  constructor(private readonly vkBotService: VkService) {}

  @MessagePattern(VkPatternEnum.SEND_MESSAGE)
  public async sendMessage(
    @Payload() data: IVkEventEmitMap[VkPatternEnum.SEND_MESSAGE],
    @Ctx() context: RmqContext,
  ) {
    return this.vkBotService.handleSendNotification(context, data);
  }

  @MessagePattern(VkPatternEnum.SEND_CHECK_CLIENT_IN_GROUP)
  public async checkUserInGroup(
    @Payload() data: IVkEventEmitMap[VkPatternEnum.SEND_CHECK_CLIENT_IN_GROUP],
    @Ctx() context: RmqContext,
  ) {
    return this.vkBotService.handleCheckUserInGroup(context, data);
  }
}
