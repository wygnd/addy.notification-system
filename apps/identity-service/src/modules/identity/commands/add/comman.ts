import { TIdentityCreationEntity } from '@addy/common';
import { IdentityDTO } from '@modules/identity/dtos';
import { Command } from '@nestjs/cqrs';

export class IdentityAddCommand extends Command<IdentityDTO> {
  constructor(public readonly createFields: TIdentityCreationEntity) {
    super();
  }
}
