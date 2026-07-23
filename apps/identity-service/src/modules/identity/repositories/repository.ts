import { Injectable } from '@nestjs/common';
import {
  IIdentityRepositoryPort,
  TIdentityCreationEntity,
} from '@modules/identity/interfaces';
import { IdentityModel } from '@modules/identity/models';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class IdentityRepository implements IIdentityRepositoryPort {
  constructor(
    @InjectModel(IdentityModel)
    private readonly repo: typeof IdentityModel,
  ) {}

  public async getOrCreate(
    fields: TIdentityCreationEntity,
  ): Promise<IdentityModel> {
    const result = await this.repo.findOrCreate({
      where: {
        platform: fields.platform,
        externalUserId: fields.externalUserId,
        platformUserId: fields.platformUserId,
      },
    });

    return result[0];
  }
}
