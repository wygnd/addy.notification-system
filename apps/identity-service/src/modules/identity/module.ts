import { IdentityRMQController } from '@modules/identity/controllers';
import { IdentityModel } from '@modules/identity/models';
import { IdentityProvider } from '@modules/identity/providers/provider';
import { identityProviders } from '@modules/identity/providers/providers';
import { OtpModule } from '@modules/opt/module';
import { RedisModule } from '@modules/redis/module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([IdentityModel]),
    RedisModule,
    OtpModule,
  ],
  controllers: [IdentityRMQController],
  providers: identityProviders,
  exports: [IdentityProvider],
})
export class IdentityModule {}
