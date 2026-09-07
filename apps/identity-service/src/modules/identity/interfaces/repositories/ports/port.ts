import { PlatformEnum } from '@addy/common';
import {
  IIdentityUpdateEntity,
  TIdentityCreationEntity,
} from '@modules/identity/interfaces';
import { IdentityModel } from '@modules/identity/models';
import { FindOptions } from 'sequelize';

export interface IIdentityRepositoryPort {
  getByExternalUserId(id: string): Promise<IdentityModel[]>;
  getByExternalUserIds(ids: string[]): Promise<IdentityModel[]>;
  create(fields: TIdentityCreationEntity): Promise<IdentityModel>;
  exists(userId: string, platform: PlatformEnum): Promise<IdentityModel | null>;
  existsOnPlatform(
    platformUserId: string,
    platform: PlatformEnum,
  ): Promise<IdentityModel | null>;
  update(
    id: string,
    updateFields: Partial<TIdentityCreationEntity>,
  ): Promise<boolean>;
  list(options?: FindOptions): Promise<IdentityModel[]>;
  bulkUpdate(items: IIdentityUpdateEntity[]): Promise<number>;
}
