import { ITelegramBotServicePort } from '@modules/telegram/interfaces';
import { Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramBotService implements ITelegramBotServicePort {
  private readonly bot: Bot;

  constructor(private readonly configService: ConfigService) {
    this.bot = new Bot(configService.getOrThrow('TELEGRAM_BOT_API_TOKEN'));
  }
}
