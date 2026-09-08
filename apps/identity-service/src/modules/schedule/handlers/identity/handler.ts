import { IdentityStatusEnum, IResponse, normalizeError } from '@addy/common';
import { IIdentityUpdateEntity } from '@modules/identity/interfaces';
import { IdentityProvider } from '@modules/identity/providers/provider';
import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Op } from 'sequelize';

@Injectable()
export class ScheduleIdentityHandler {
  constructor(
    @InjectPinoLogger(ScheduleIdentityHandler.name)
    private readonly logger: PinoLogger,

    private readonly identityService: IdentityProvider,
  ) {}

  /**
   * Отчистка подключений, которые висят в статусе `PENDING` более 10 минут
   */
  public async clearPendingConnections(): Promise<IResponse> {
    try {
      const dateNowTimestamp = Date.now();

      // Получаем список подключений
      const identities = await this.identityService.list({
        where: {
          status: IdentityStatusEnum.PENDING,
          updatedAt: {
            [Op.gt]: new Date(dateNowTimestamp - 60 * 10 * 1000),
          },
        },
      });

      // Если пусто - выходим
      if (identities.length === 0) {
        throw new Error('Identities not found');
      }

      const updateIdentityFieldList: IIdentityUpdateEntity[] = [];

      // Проходим по подключениям и отправляем в ошибку
      for (const identity of identities) {
        updateIdentityFieldList.push({
          id: identity.id,
          fields: {
            status: IdentityStatusEnum.FAILED,
          },
        });
      }

      // Отправляем в БД
      const updatedCount = await this.identityService.bulkUpdate(
        updateIdentityFieldList,
      );

      return {
        ok: true,
        detail: `Revoked ${updatedCount} items.`,
      };
    } catch (error) {
      const { message } = normalizeError(error);

      this.logger.error({
        handler: this.clearPendingConnections.name,
        error: message,
      });

      return {
        ok: false,
        detail: message,
      };
    }
  }
}
