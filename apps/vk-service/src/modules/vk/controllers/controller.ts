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
import { Channel, Message } from 'amqplib';
import { NotificationResultEnum } from '@shared/enums';

@Controller()
export class VkController {
  constructor(private readonly vkBotService: VkService) {}

  @MessagePattern(VkPatternEnum.SEND_MESSAGE)
  public async sendMessage(
    @Payload() data: IVkEventEmitMap[VkPatternEnum.SEND_MESSAGE],
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;
    const { correlationId } = data;

    try {
      await this.vkBotService.sendMessageResult(
        correlationId,
        NotificationResultEnum.PROCESSING,
      );

      await this.vkBotService.sendMessage(data.userId, data.text);

      await this.vkBotService.sendMessageResult(
        correlationId,
        NotificationResultEnum.COMPLETED,
      );

      channel.ack(originalMsg);
    } catch (error) {
      channel.nack(originalMsg, false, false);
      await this.vkBotService.sendMessageResult(
        correlationId,
        NotificationResultEnum.FAILED,
      );
    }
  }
}
