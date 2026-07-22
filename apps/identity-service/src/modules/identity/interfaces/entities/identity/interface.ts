import { PlatformEnum } from '@shared/enums';

export enum IdentityStatusEnum {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REVOKED = 'revoked',
}

export interface IIdentityEntity {
  id: string;
  externalUserId: string;
  platform: PlatformEnum;
  platformUserId: string | null;
  status: IdentityStatusEnum;
  verifiedAt: string | null;
  updatedAt: string;
  createdAt: string;
}

export type TIdentityCreationEntity = Omit<
  IIdentityEntity,
  'id' | 'updatedAt' | 'createdAt'
>;
