import { IdentityModel } from '@modules/identity/models';
import { TIdentityCreationEntity } from '@modules/identity/interfaces';

export interface IIdentityRepositoryPort {
  getOrCreate(fields: TIdentityCreationEntity): Promise<IdentityModel>;
}
