import { IdentityStatusEnum, PlatformEnum } from '@addy/common';
import {
  IIdentityEntity,
  TIdentityCreationEntity,
} from '@modules/identity/interfaces';
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'platform_identities',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_platform_identities_external_user',
      fields: ['external_user_id', 'platform'],
      unique: true,
    },
    {
      name: 'idx_platform_identities_platform_user',
      fields: ['platform', 'platform_user_id'],
      unique: true,
    },
  ],
})
export class IdentityModel extends Model<
  IIdentityEntity,
  TIdentityCreationEntity
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare externalUserId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare platform: PlatformEnum;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare platformUserId: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: IdentityStatusEnum.PENDING,
  })
  declare status: IdentityStatusEnum;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare verifiedAt: string | null;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
