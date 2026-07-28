import { NotificationLogStatusEnum, PlatformEnum } from '@addy/common';
import {
  INotificationLogCreateEntity,
  INotificationLogEntity,
} from '@modules/notifications/interfaces';
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'notification_logs',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_notification_logs_correlation_id',
      fields: ['correlation_id'],
    },
    { name: 'idx_notification_logs_status', fields: ['status'] },
    { name: 'idx_notification_logs_channel', fields: ['channel'] },
  ],
})
export class NotificationLogModel extends Model<
  INotificationLogEntity,
  INotificationLogCreateEntity
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare correlationId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare channel: PlatformEnum;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare pattern: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: NotificationLogStatusEnum.RECEIVED,
  })
  declare status: NotificationLogStatusEnum;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  declare payload: Record<string, unknown> | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare errorMessage: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare userId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  declare retryCount: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare completedAt: Date | null;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
