import { Command } from '@nestjs/cqrs';
import { TIdentityCreationEntity } from '@modules/identity/interfaces';
import { IdentityDTO } from '@modules/identity/dtos';

export class IdentityAddCommand extends Command<IdentityDTO> {
  constructor(public readonly createFields: TIdentityCreationEntity) {
    super();
  }
}
