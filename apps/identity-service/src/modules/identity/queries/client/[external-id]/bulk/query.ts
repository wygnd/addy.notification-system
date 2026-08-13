import { IdentityDTO } from '@modules/identity/dtos';
import { Query } from '@nestjs/cqrs';

export class IdentityGetClientByExternalIDsQuery extends Query<IdentityDTO[]> {
  constructor(public readonly clientIds: string[]) {
    super();
  }
}
