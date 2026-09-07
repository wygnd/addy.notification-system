import { IdentityDTO } from '@modules/identity/dtos';
import { IIdentityEntity } from '@modules/identity/interfaces';
import { Query } from '@nestjs/cqrs';
import { FindOptions } from 'sequelize';

export class IdentityListQuery extends Query<IdentityDTO[]> {
  constructor(public readonly options?: FindOptions<IIdentityEntity>) {
    super();
  }
}
