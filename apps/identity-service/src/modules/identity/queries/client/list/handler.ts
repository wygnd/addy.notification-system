import { IDENTITY_REPOSITORY } from '@modules/identity/constants/constants';
import { IdentityDTO } from '@modules/identity/dtos';
import type { IIdentityRepositoryPort } from '@modules/identity/interfaces';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IdentityListQuery } from './query';
import { IdentityMapper } from '@modules/identity/mappres/mapper';

@QueryHandler(IdentityListQuery)
export class IdentityListQueryHandler implements IQueryHandler<IdentityListQuery> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IIdentityRepositoryPort,
  ) {}

  public async execute(query: IdentityListQuery): Promise<IdentityDTO[]> {
    const models = await this.repo.list(query.options);

    return models.map(model => IdentityMapper.toDomain(model));
  }
}
