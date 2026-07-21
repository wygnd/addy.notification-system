import { Controller, Get } from '@nestjs/common';
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
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.vkBotService.sendMessage(data.userId, data.text);

      channel.ack(originalMsg);
    } catch (error) {
      channel.nack(originalMsg, false, false);
    }
  }
}
