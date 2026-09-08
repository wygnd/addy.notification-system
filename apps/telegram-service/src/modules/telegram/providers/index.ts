import {
  TelegramBotConnectCommandHandler,
  TelegramBotConnectMessageHandler,
  TelegramBotDisconnectCommandHandler,
  TelegramBotDisconnectMessageHandler,
  TelegramBotRegistrator,
  TelegramBotStartCommandHandler,
  TelegramBotTextMessageHandler,
} from '@modules/telegram/bot';
import { TelegramBotMenuConnectService } from '@modules/telegram/bot/menu/connect';
import { TELEGRAM_BOT } from '@modules/telegram/constants';
import { TelegramConnectionMiddleware } from '@modules/telegram/middlewares';
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
  TelegramBotDisconnectMessageHandler,

  // Middlewares
  TelegramConnectionMiddleware,

  // Menu Handlers
  TelegramBotMenuConnectService,

  // PROVIDERS
  TelegramNotificationProvider,

  // SERVICES
  TelegramBotRegistrator,
  TelegramBotApiService,
  TelegramService,
];
