import {
  AppException,
  ErrorCodeEnum,
  ITelegramEventEmitMap,
  PlatformEnum,
  TelegramEmitPatternEnum,
} from '@addy/common';
import { IdentityService } from '@modules/identity/services/service';
import { TelegramProvider } from '@modules/telegram/providers/provider';
import {
  IUserConnectFields,
  IUserConnectResponse,
} from '@modules/users/interfaces';
import { Injectable } from '@nestjs/common';
import {
  IPlatformMessenger,
  IPlatformSendMessagePayload,
} from '@shared/interfaces';

@Injectable()
export class TelegramService implements IPlatformMessenger {
  constructor(
    private readonly telegramProvider: TelegramProvider,
    private readonly identityService: IdentityService,
  ) {}

  private async emitEvent<
    T extends TelegramEmitPatternEnum = TelegramEmitPatternEnum,
  >(pattern: T, data: ITelegramEventEmitMap[T]): Promise<void> {
    return this.telegramProvider.emit(pattern, data);
  }

  /**
   * Отправляет сообщение в сервис
   * @param data
   */
  public async sendMessage(data: IPlatformSendMessagePayload): Promise<void> {
    return this.emitEvent(TelegramEmitPatternEnum.SEND_MESSAGE, {
      text: data.text,
      userId: data.userId,
      correlationId: data.correlationId,
    });
  }

  public async connect(
    data: IUserConnectFields,
  ): Promise<IUserConnectResponse> {
    if (data.platform !== PlatformEnum.TELEGRAM) {
      throw new AppException(
        ErrorCodeEnum.NOT_ALLOWED,
        `Invalid platform for ${data.platform} messenger`,
      );
    }

    return this.identityService.connectClient({
      platform: data.platform,
      userId: data.userId,
    });
  }
}
