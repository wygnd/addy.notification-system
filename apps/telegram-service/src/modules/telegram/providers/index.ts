import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';
import { TELEGRAM_BOT } from '@modules/telegram/constants';

export const TelegramProviders = [
  {
    provide: TELEGRAM_BOT,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return new Bot(configService.getOrThrow('TELEGRAM_BOT_API_TOKEN'));
    },
  },
];
