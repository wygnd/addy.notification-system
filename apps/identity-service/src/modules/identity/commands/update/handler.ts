import { IdentityUpdateCommand } from '@modules/identity/commands/update/command';
import { IDENTITY_REPOSITORY } from '@modules/identity/constants/constants';
import { type IIdentityRepositoryPort } from '@modules/identity/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(IdentityUpdateCommand)
export class IdentityUpdateCommandHandler implements ICommandHandler<IdentityUpdateCommand> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IIdentityRepositoryPort,
  ) {}

  public async execute(command: IdentityUpdateCommand): Promise<boolean> {
    return this.repo.update(command.id, command.updateFields);
  }
}
