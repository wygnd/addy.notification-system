import { TIdentityCreationEntity } from '@modules/identity/interfaces';
import { Command } from '@nestjs/cqrs';

export class IdentityUpdateCommand extends Command<boolean> {
  constructor(
    public readonly id: string,
    public readonly updateFields: Partial<TIdentityCreationEntity>,
  ) {
    super();
  }
}
