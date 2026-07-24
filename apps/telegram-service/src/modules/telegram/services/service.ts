import { TELEGRAM_BOT } from '@modules/telegram/constants';
import { Inject, Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import type { Update } from 'grammy/types';

@Injectable()
export class TelegramService {
  constructor(
    @Inject(TELEGRAM_BOT)
    private readonly bot: Bot,
  ) {}

  public async handleWebhook(body: Update) {
    await this.bot.handleUpdate(body);
  }
}
