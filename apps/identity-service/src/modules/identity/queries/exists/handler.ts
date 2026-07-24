import { IDENTITY_REPOSITORY } from '@modules/identity/constants/constants';
import { IdentityDTO } from '@modules/identity/dtos';
import { type IIdentityRepositoryPort } from '@modules/identity/interfaces';
import { IdentityMapper } from '@modules/identity/mappres/mapper';
import { IdentityExistsQuery } from '@modules/identity/queries/exists/query';
import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(IdentityExistsQuery)
export class IdentityExistsQueryHandler implements IQueryHandler<IdentityExistsQuery> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IIdentityRepositoryPort,
  ) {}

  public async execute(
    query: IdentityExistsQuery,
  ): Promise<IdentityDTO | null> {
    const model = await this.repo.exists(query.userId, query.platform);

    if (!model) {
      return null;
    }

    return IdentityMapper.toDomain(model);
  }
}
