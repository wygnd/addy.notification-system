import {
  TelegramBotConnectCommandHandler,
  TelegramBotConnectMessageHandler,
  TelegramBotDisconnectCommandHandler,
  TelegramBotDisconnectMessageHandler,
  TelegramBotStartCommandHandler,
  TelegramBotTextMessageHandler,
} from '@modules/telegram/bot';
import { TelegramBotMenuConnectService } from '@modules/telegram/bot/menu/connect';
import { TELEGRAM_BOT } from '@modules/telegram/constants';
import {
  ITelegramCommandHandler,
  ITelegramMessageHandler,
} from '@modules/telegram/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { Bot } from 'grammy';

@Injectable()
export class TelegramBotRegistrator {
  private readonly commandHandlerList: ITelegramCommandHandler[] = [];
  private readonly messageHandlerList: ITelegramMessageHandler[] = [];

  constructor(
    @Inject(TELEGRAM_BOT)
    private readonly bot: Bot,

    // Command Handlers
    private readonly startHandler: TelegramBotStartCommandHandler,
    private readonly connectHandler: TelegramBotConnectCommandHandler,
    private readonly disconnectHandler: TelegramBotDisconnectCommandHandler,

    // Text Handlers
    private readonly messageTextHandler: TelegramBotTextMessageHandler,
    private readonly messageConnectHandler: TelegramBotConnectMessageHandler,
    private readonly messageDisconnectHandler: TelegramBotDisconnectMessageHandler,

    // Menu Handlers
    private readonly menuConnectHandler: TelegramBotMenuConnectService,
  ) {
    this.commandHandlerList.push(this.startHandler);
    this.commandHandlerList.push(this.connectHandler);
    this.commandHandlerList.push(this.disconnectHandler);

    this.messageHandlerList.push(this.messageConnectHandler);

    this.messageHandlerList.push(this.messageDisconnectHandler);
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

  public registerMenu(): void {
    this.bot.use(this.menuConnectHandler.getConnectMenu());
  }
}
