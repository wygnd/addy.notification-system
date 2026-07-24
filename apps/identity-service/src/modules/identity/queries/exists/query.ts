import { IdentityDTO } from '@modules/identity/dtos';
import { Query } from '@nestjs/cqrs';
import { PlatformEnum } from '@shared/enums';

export class IdentityExistsQuery extends Query<IdentityDTO | null> {
  constructor(
    public readonly userId: string,
    public readonly platform: PlatformEnum,
  ) {
    super();
  }
}
