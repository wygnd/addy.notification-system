import { IIdentityUpdateEntity } from '@addy/common';
import { Command } from '@nestjs/cqrs';

export class IdentityUpdateCommand extends Command<boolean> {
  constructor(
    public readonly fields: IIdentityUpdateEntity,
  ) {
    super();
  }
}
