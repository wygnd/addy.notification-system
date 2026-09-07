import { PlatformEnum } from '@addy/common';
import {
  IIdentityRepositoryPort,
  IIdentityUpdateEntity,
  TIdentityCreationEntity,
} from '@modules/identity/interfaces';
import { IdentityModel } from '@modules/identity/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class IdentityRepository implements IIdentityRepositoryPort {
  constructor(
    @InjectModel(IdentityModel)
    private readonly repo: typeof IdentityModel,
    private readonly sequelize: Sequelize,
  ) {}

  public async create(fields: TIdentityCreationEntity): Promise<IdentityModel> {
    return this.repo.create(fields);
  }

  public async exists(
    userId: string,
    platform: PlatformEnum,
  ): Promise<IdentityModel | null> {
    return this.repo.findOne({
      where: {
        externalUserId: userId,
        platform: platform,
      },
    });
  }

  public async existsOnPlatform(
    platformUserId: string,
    platform: PlatformEnum,
  ): Promise<IdentityModel | null> {
    return this.repo.findOne({
      where: {
        platformUserId: platformUserId,
        platform: platform,
      },
    });
  }

  public async update(
    id: string,
    updateFields: Partial<TIdentityCreationEntity>,
  ): Promise<boolean> {
    const updated = await this.repo.update(updateFields, {
      where: { id: id },
    });

    return updated[0] > 0;
  }

  public async getByExternalUserId(id: string): Promise<IdentityModel[]> {
    return this.repo.findAll({ where: { externalUserId: id } });
  }

  public async getByExternalUserIds(ids: string[]): Promise<IdentityModel[]> {
    return this.repo.findAll({
      where: {
        externalUserId: {
          [Op.in]: ids,
        },
      },
    });
  }

  public async list(options?: FindOptions): Promise<IdentityModel[]> {
    return this.repo.findAll(options);
  }

  public async bulkUpdate(items: IIdentityUpdateEntity[]): Promise<number> {
    const transaction = await this.sequelize.transaction();

    try {
      let updatedCount = 0;
      const updatedItems = await Promise.all(
        items.map((item) =>
          this.repo.update(item.fields, {
            where: { id: item.id },
          }),
        ),
      );

      updatedItems.reduce((acc, [updated]) => {
        acc += updated;
        return acc;
      }, updatedCount);

      await transaction.commit();
      return updatedCount;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
