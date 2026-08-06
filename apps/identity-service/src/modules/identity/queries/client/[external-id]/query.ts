import { IdentityDTO } from '@modules/identity/dtos';
import { Query } from '@nestjs/cqrs';

export class IdentityGetClientByExternalIDQuery extends Query<IdentityDTO[]> {
  constructor(public readonly clientId: string) {
    super();
  }
}
