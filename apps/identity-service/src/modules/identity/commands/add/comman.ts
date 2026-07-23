import { Command } from '@nestjs/cqrs';
import {
  IIdentityEntity,
  TIdentityCreationEntity,
} from '@modules/identity/interfaces';

export class IdentityAddCommand extends Command<IIdentityEntity> {
  constructor(public readonly createFields: TIdentityCreationEntity) {
    super();
  }
}
