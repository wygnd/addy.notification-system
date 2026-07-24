import { IdentityStatusEnum, PlatformEnum } from '@addy/common';
import { IIdentityEntity } from '@modules/identity/interfaces';
import { Expose } from 'class-transformer';

export class IdentityDTO implements IIdentityEntity {
  @Expose()
  id: string;

  @Expose()
  externalUserId: string;

  @Expose()
  platform: PlatformEnum;

  @Expose()
  platformUserId: string | null;

  @Expose()
  status: IdentityStatusEnum;

  @Expose()
  verifiedAt: string | null;

  @Expose()
  updatedAt: string;

  @Expose()
  createdAt: string;
}
