import { IDENTITY_REPOSITORY } from '@modules/identity/constants/constants';
import type { IIdentityRepositoryPort } from '@modules/identity/interfaces';
import { IdentityMapper } from '@modules/identity/mappres/mapper';
import { IdentityExistsPlatformQuery } from '@modules/identity/queries/exists/platform/query';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(IdentityExistsPlatformQuery)
export class IdentityExitsPlatformQueryHandler implements IQueryHandler<IdentityExistsPlatformQuery> {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IIdentityRepositoryPort,
  ) {}

  public async execute(query: IdentityExistsPlatformQuery) {
    const model = await this.repo.existsOnPlatform(
      query.platformUserId,
      query.platform,
    );

    if (!model) {
      return null;
    }

    return IdentityMapper.toDomain(model);
  }
}
