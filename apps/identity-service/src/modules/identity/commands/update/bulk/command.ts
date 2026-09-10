import { Command } from '@nestjs/cqrs';
import { IIdentityUpdateEntity } from '@addy/common';

export class IdentityBulkUpdateCommand extends Command<number> {
  constructor(public readonly items: IIdentityUpdateEntity[]) {
    super();
  }
}
