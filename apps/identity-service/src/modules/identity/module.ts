import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IdentityModel } from '@modules/identity/models';
import { IdentityRMQController } from '@modules/identity/controllers';

@Module({
  imports: [SequelizeModule.forFeature([IdentityModel])],
  controllers: [IdentityRMQController],
})
export class IdentityModule {}
