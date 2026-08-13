import {
  TelegramBotConnectCommandHandler,
  TelegramBotConnectMessageHandler,
  TelegramBotDisconnectCommandHandler,
  TelegramBotRegistrator,
  TelegramBotStartCommandHandler,
  TelegramBotTextMessageHandler,
} from '@modules/telegram/bot';
import { TELEGRAM_BOT } from '@modules/telegram/constants';
import { TelegramNotificationProvider } from '@modules/telegram/providers/provider';
import {
  TelegramBotApiService,
  TelegramService,
} from '@modules/telegram/services';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';
import { HttpsProxyAgent } from 'https-proxy-agent';

export const TelegramProviders = [
  {
    provide: TELEGRAM_BOT,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const botToken = configService.getOrThrow<string>(
        'TELEGRAM_BOT_API_TOKEN',
      );
      const proxyURL = configService.get<string>('TELEGRAM_PROXY_URL');

      if (!proxyURL) {
        return new Bot(botToken);
      }

      const proxyAgent = new HttpsProxyAgent(proxyURL);

      return new Bot(botToken, {
        client: {
          baseFetchConfig: {
            agent: proxyAgent,
          },
        },
      });
    },
  },

  // COMMANDS
  TelegramBotStartCommandHandler,
  TelegramBotConnectCommandHandler,
  TelegramBotDisconnectCommandHandler,

  // MESSAGE HEARS
  TelegramBotTextMessageHandler,
  TelegramBotConnectMessageHandler,

  // PROVIDERS
  TelegramNotificationProvider,

  // SERVICES
  TelegramBotRegistrator,
  TelegramBotApiService,
  TelegramService,
];
