import { OtpModule } from '@modules/opt/module';
import { RedisModule } from '@modules/redis/module';
import { scheduleIdentityProviders } from '@modules/schedule/providers/identity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from './database/module';
import { IdentityModule } from './identity/module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CqrsModule.forRoot(),
    DatabaseModule,
    IdentityModule,
    RedisModule,
    OtpModule,
  ],
  providers: scheduleIdentityProviders,
})
export class AppModule {}
