import { normalizeError, PlatformEnum } from '@addy/common';
import {
  IdentityBulkUpdateCommand,
  IdentityUpdateCommand,
} from '@modules/identity/commands';
import { IdentityDTO } from '@modules/identity/dtos';
import {
  IIdentityEntity,
  IIdentityUpdateEntity,
  TIdentityCreationEntity,
} from '@modules/identity/interfaces';
import {
  IdentityExistsPlatformQuery,
  IdentityExistsQuery,
  IdentityListQuery,
} from '@modules/identity/queries';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { FindOptions } from 'sequelize';

@Injectable()
export class IdentityProvider {
  constructor(
    @InjectPinoLogger(IdentityProvider.name)
    private readonly logger: PinoLogger,

    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Поиск клиента по platformUserId
   * @param platformUserId
   * @param platform
   */
  public async getClientByPlatformId(
    platformUserId: string,
    platform: PlatformEnum,
  ): Promise<IdentityDTO | null> {
    try {
      return await this.queryBus.execute(
        new IdentityExistsPlatformQuery(platformUserId, platform),
      );
    } catch (error) {
      this.logger.error({
        handler: this.getClientByPlatformId.name,
        error: normalizeError(error),
      });

      return null;
    }
  }

  /**
   * Поиск клиента по external_user_id
   * @param userId
   * @param platform
   */
  public async getClientByExternalId(
    userId: string,
    platform: PlatformEnum,
  ): Promise<IdentityDTO | null> {
    try {
      return await this.queryBus.execute(
        new IdentityExistsQuery(userId, platform),
      );
    } catch (error) {
      this.logger.error({
        handler: this.getClientByPlatformId.name,
        error: normalizeError(error),
      });
      return null;
    }
  }

  /**
   * Обновление клиента
   * @param id
   * @param fields
   */
  public async updateIdentity(
    id: string,
    fields: Partial<TIdentityCreationEntity>,
  ): Promise<boolean> {
    try {
      return await this.commandBus.execute(
        new IdentityUpdateCommand(id, fields),
      );
    } catch (error) {
      this.logger.error({
        handler: this.updateIdentity.name,
        error: normalizeError(error),
      });

      return false;
    }
  }

  public async list(options?: FindOptions<IIdentityEntity>) {
    try {
      return await this.queryBus.execute(new IdentityListQuery(options));
    } catch (error) {
      this.logger.error({
        handler: this.list.name,
        error: normalizeError(error),
      });

      return [];
    }
  }

  /**
   * Обновление нескольких записей
   */
  public async bulkUpdate(items: IIdentityUpdateEntity[]): Promise<number> {
    try {
      return await this.commandBus.execute(
        new IdentityBulkUpdateCommand(items),
      );
    } catch (error) {
      this.logger.error({
        handler: this.bulkUpdate.name,
        error: normalizeError(error),
      });
      return 0;
    }
  }
}
