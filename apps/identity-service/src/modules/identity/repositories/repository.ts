import { PlatformEnum } from '@addy/common';
import {
  IIdentityRepositoryPort,
  TIdentityCreationEntity,
} from '@modules/identity/interfaces';
import { IdentityModel } from '@modules/identity/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class IdentityRepository implements IIdentityRepositoryPort {
  constructor(
    @InjectModel(IdentityModel)
    private readonly repo: typeof IdentityModel,
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
}
