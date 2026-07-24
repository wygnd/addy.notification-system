import { Injectable } from '@nestjs/common';
import {
  IdentityStatusEnum,
  IIdentityRepositoryPort,
  TIdentityCreationEntity,
} from '@modules/identity/interfaces';
import { IdentityModel } from '@modules/identity/models';
import { InjectModel } from '@nestjs/sequelize';
import { PlatformEnum } from '@shared/enums';
import { Op } from 'sequelize';

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
}
