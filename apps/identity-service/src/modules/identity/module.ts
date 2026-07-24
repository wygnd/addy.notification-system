import { IdentityRMQController } from '@modules/identity/controllers';
import { IdentityModel } from '@modules/identity/models';
import { identityProviders } from '@modules/identity/providers/providers';
import { RedisModule } from '@modules/redis/module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([IdentityModel]), RedisModule],
  controllers: [IdentityRMQController],
  providers: identityProviders,
})
export class IdentityModule {}
