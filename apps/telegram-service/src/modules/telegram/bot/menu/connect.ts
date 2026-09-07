import { Menu, MenuRange } from '@grammyjs/menu';
import { IdentityService } from '@modules/identity/services/service';
import { TELEGRAM_BOT_MESSAGE_HEAR_CONSTANTS } from '@modules/telegram/constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramBotMenuConnectService {
  private readonly menu: Menu;

  constructor(private readonly identityService: IdentityService) {
    this.menu = new Menu('connect-menu').dynamic(async (ctx) => {
      const menuRange = new MenuRange();

      const isConnected = await this.identityService.checkClientPlatform(
        ctx.from!.id.toString(),
      );

      if (isConnected.status) {
        menuRange.text(TELEGRAM_BOT_MESSAGE_HEAR_CONSTANTS.CLIENT_DISCONNECT);
      } else {
        menuRange.text(TELEGRAM_BOT_MESSAGE_HEAR_CONSTANTS.CLIENT_CONNECT);
      }

      return menuRange;
    });
  }

  public getConnectMenu() {
    return this.menu;
  }
}
