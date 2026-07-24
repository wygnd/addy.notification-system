import { PlatformEnum } from '@addy/common';
import { IdentityDTO } from '@modules/identity/dtos';
import { Query } from '@nestjs/cqrs';

export class IdentityExistsPlatformQuery extends Query<IdentityDTO | null> {
  constructor(
    public readonly platformUserId: string,
    public readonly platform: PlatformEnum,
  ) {
    super();
  }
}
