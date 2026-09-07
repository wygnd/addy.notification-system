import { IIdentityUpdateEntity } from '@modules/identity/interfaces';
import { Command } from '@nestjs/cqrs';

export class IdentityBulkUpdateCommand extends Command<number> {
  constructor(public readonly items: IIdentityUpdateEntity[]) {
    super();
  }
}
