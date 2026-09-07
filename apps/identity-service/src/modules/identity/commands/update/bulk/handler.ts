import { IDENTITY_REPOSITORY } from '@modules/identity/constants/constants';
import { type IIdentityRepositoryPort } from '@modules/identity/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IdentityBulkUpdateCommand } from './command';

@CommandHandler(IdentityBulkUpdateCommand)
export class IdentityBulkUpdateCommandHandler implements ICommandHandler<IdentityBulkUpdateCommand> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IIdentityRepositoryPort,
  ) {}

  public async execute(command: IdentityBulkUpdateCommand): Promise<number> {
    return this.repo.bulkUpdate(command.items);
  }
}
