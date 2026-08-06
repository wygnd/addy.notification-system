import {
  TelegramBotConnectMessageHandler,
  TelegramBotStartCommandHandler,
  TelegramBotTextMessageHandler,
} from '@modules/telegram/bot';
import { TELEGRAM_BOT } from '@modules/telegram/constants';
import {
  ITelegramCommandHandler,
  ITelegramMessageHandler,
} from '@modules/telegram/interfaces';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Bot } from 'grammy';

@Injectable()
export class TelegramBotRegistrator {
  private readonly logger = new Logger(TelegramBotRegistrator.name);
  private readonly commandHandlerList: ITelegramCommandHandler[] = [];
  private readonly messageHandlerList: ITelegramMessageHandler[] = [];

  constructor(
    @Inject(TELEGRAM_BOT)
    private readonly bot: Bot,
    private readonly startHandler: TelegramBotStartCommandHandler,

    private readonly messageTextHandler: TelegramBotTextMessageHandler,
    private readonly messageConnectHandler: TelegramBotConnectMessageHandler,
  ) {
    this.commandHandlerList.push(this.startHandler);

    this.messageHandlerList.push(this.messageConnectHandler);
  }

  public register(): void {
    for (const handler of this.commandHandlerList) {
      this.bot.command(handler.command, (ctx) => handler.handle(ctx));
    }

    for (const handler of this.messageHandlerList) {
      this.bot.hears(handler.pattern, (ctx) => handler.handle(ctx));
    }

    this.bot.on(this.messageTextHandler.pattern, (ctx) =>
      this.messageTextHandler.handle(ctx),
    );
  }
}
