import { IDENTITY_REPOSITORY } from '@modules/identity/constants/constants';
import { type IIdentityRepositoryPort } from '@modules/identity/interfaces';
import { IdentityMapper } from '@modules/identity/mappres/mapper';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IdentityGetClientByExternalIDQuery } from './query';

@QueryHandler(IdentityGetClientByExternalIDQuery)
export class IdentityGetClientByExternalIDQueryHandler implements IQueryHandler<IdentityGetClientByExternalIDQuery> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IIdentityRepositoryPort,
  ) {}

  public async execute(query: IdentityGetClientByExternalIDQuery) {
    const models = await this.repo.getByExternalUserId(query.clientId);

    return models.map((model) => IdentityMapper.toDomain(model));
  }
}
