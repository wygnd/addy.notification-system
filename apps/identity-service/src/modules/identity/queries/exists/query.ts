import { PlatformEnum } from '@addy/common';
import { IdentityDTO } from '@modules/identity/dtos';
import { Query } from '@nestjs/cqrs';

export class IdentityExistsQuery extends Query<IdentityDTO | null> {
  constructor(
    public readonly userId: string,
    public readonly platform: PlatformEnum,
  ) {
    super();
  }
}
