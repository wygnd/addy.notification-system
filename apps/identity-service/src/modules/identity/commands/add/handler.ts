import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IdentityAddCommand } from './comman';
import { IDENTITY_REPOSITORY } from '@modules/identity/constants/constants';
import { Inject } from '@nestjs/common';
import { type IIdentityRepositoryPort } from '@modules/identity/interfaces';
import { IdentityMapper } from '@modules/identity/mappres/mapper';
import { IdentityDTO } from '@modules/identity/dtos';

@CommandHandler(IdentityAddCommand)
export class IdentityAddCommandHandler implements ICommandHandler<IdentityAddCommand> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IIdentityRepositoryPort,
  ) {}

  public async execute(command: IdentityAddCommand): Promise<IdentityDTO> {
    const model = await this.repo.create(command.createFields);

    return IdentityMapper.toDomain(model);
  }
}
