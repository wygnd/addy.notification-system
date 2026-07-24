import { TelegramWebhookGuard } from '@modules/telegram/guards/webhook';
import { TelegramService } from '@modules/telegram/services';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { Update } from 'grammy/types';

@Controller({
  version: '1',
  path: 'telegram',
})
export class TelegramHttpControllerV1 {
  constructor(private readonly telegramService: TelegramService) {}

  @UseGuards(TelegramWebhookGuard)
  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  public async handleWebhook(@Body() body: Update) {
    return this.telegramService.handleWebhook(body);
  }
}
