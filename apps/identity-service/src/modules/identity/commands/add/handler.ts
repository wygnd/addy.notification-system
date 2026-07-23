import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IdentityAddCommand } from '@modules/identity/commands/add/comman';
import { IDENTITY_REPOSITORY } from '@modules/identity/constants/constants';
import { Inject } from '@nestjs/common';
import { type IIdentityRepositoryPort } from '@modules/identity/interfaces';

@CommandHandler(IdentityAddCommand)
export class IdentityAddCommandHandler implements ICommandHandler<IdentityAddCommand> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IIdentityRepositoryPort,
  ) {}

  public async execute(command: IdentityAddCommand) {
    const model = await this.repo.getOrCreate(command.createFields);
    // todo
  }
}
