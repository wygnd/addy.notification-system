import { IDENTITY_REPOSITORY } from '@modules/identity/constants/constants';
import { type IIdentityRepositoryPort } from '@modules/identity/interfaces';
import { IdentityMapper } from '@modules/identity/mappres/mapper';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IdentityGetClientByExternalIDsQuery } from './query';

@QueryHandler(IdentityGetClientByExternalIDsQuery)
export class IdentityGetClientByExternalIDsQueryHandler implements IQueryHandler<IdentityGetClientByExternalIDsQuery> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IIdentityRepositoryPort,
  ) {}

  public async execute(query: IdentityGetClientByExternalIDsQuery) {
    const models = await this.repo.getByExternalUserIds(query.clientIds);

    return models.map((model) => IdentityMapper.toDomain(model));
  }
}
