import { normalizeError } from '@addy/common';
import { IAddyApiNotificationsPlatformSet } from '@modules/addy/interfaces';
import { AddyApiProvider } from '@modules/addy/providers';
import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AddyApiService {
  constructor(
    @InjectPinoLogger(AddyApiService.name)
    private readonly logger: PinoLogger,

    private readonly addyApi: AddyApiProvider,
  ) {}

  /**
   * Отправляет событие о том, что клиент подключил аккаунт
   * @param data
   */
  public async sendNotificationSetPlatform(
    data: IAddyApiNotificationsPlatformSet,
  ): Promise<boolean> {
    try {
      await this.addyApi.post('/notification-bot/set-platform', data);

      return true;
    } catch (error) {
      this.logger.error({
        handler: this.sendNotificationSetPlatform.name,
        error: normalizeError(error),
      });

      return false;
    }
  }
}
