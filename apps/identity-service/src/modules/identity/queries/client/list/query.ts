import { IIdentityEntity } from '@addy/common';
import { IdentityDTO } from '@modules/identity/dtos';
import { Query } from '@nestjs/cqrs';
import { FindOptions } from 'sequelize';

export class IdentityListQuery extends Query<IdentityDTO[]> {
  constructor(public readonly options?: FindOptions<IIdentityEntity>) {
    super();
  }
}
