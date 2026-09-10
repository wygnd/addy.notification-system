import { IdentityStatusEnum, PlatformEnum } from '@src/enums';




export interface IIdentityEntity {
  id: string;
  externalUserId: string;
  platform: PlatformEnum;
  platformUserId: string | null;
  status: IdentityStatusEnum;
  isActive: boolean;
  verifiedAt: string | null;
  updatedAt: string;
  createdAt: string;
}

export type TIdentityCreationEntity = Omit<
  IIdentityEntity,
  'id' | 'updatedAt' | 'createdAt'
>;

export type TIdentityUpdateFields = Partial<
  Omit<
    IIdentityEntity,
    | 'id'
    | 'externalUserId'
    | 'platform'
    | 'updatedAt'
    | 'createdAt'
  >
>;

export interface IIdentityUpdateEntity {
  id: string;
  fields: TIdentityUpdateFields;
}
