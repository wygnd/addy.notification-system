import { IdentityDTO } from '@modules/identity/dtos';
import { TIdentityCreationEntity } from '@modules/identity/interfaces';
import { Command } from '@nestjs/cqrs';

export class IdentityAddCommand extends Command<IdentityDTO> {
  constructor(public readonly createFields: TIdentityCreationEntity) {
    super();
  }
}
