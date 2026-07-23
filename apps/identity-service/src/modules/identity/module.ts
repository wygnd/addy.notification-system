import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IdentityModel } from '@modules/identity/models';
import { IdentityRMQController } from '@modules/identity/controllers';
import { identityProviders } from '@modules/identity/providers/providers';

@Module({
  imports: [SequelizeModule.forFeature([IdentityModel])],
  controllers: [IdentityRMQController],
  providers: identityProviders,
})
export class IdentityModule {}
