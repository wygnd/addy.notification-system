import { ITelegramEventEmitMap, TelegramEmitPatternEnum } from '@addy/common';
import { TelegramService } from '@modules/telegram/services';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class TelegramRMQController {
  constructor(private readonly telegramService: TelegramService) {}

  @MessagePattern(TelegramEmitPatternEnum.SEND_MESSAGE)
  public async sendMessage(
    @Payload()
    data: ITelegramEventEmitMap[TelegramEmitPatternEnum.SEND_MESSAGE],
    @Ctx() context: RmqContext,
  ) {
    return this.telegramService.handleSendMessage(context, data);
  }
}
