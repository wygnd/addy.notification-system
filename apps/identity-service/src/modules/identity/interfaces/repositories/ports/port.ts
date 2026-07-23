import { IdentityModel } from '@modules/identity/models';
import { TIdentityCreationEntity } from '@modules/identity/interfaces';
import { PlatformEnum } from '@shared/enums';

export interface IIdentityRepositoryPort {
  create(fields: TIdentityCreationEntity): Promise<IdentityModel>;
  exists(userId: string, platform: PlatformEnum): Promise<IdentityModel | null>;
}
