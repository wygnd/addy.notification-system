import { configurePinoLogger } from '@addy/common';
import { OtpModule } from '@modules/opt/module';
import { RedisModule } from '@modules/redis/module';
import { ScheduleModule } from '@modules/schedule/module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { IS_PRODUCTION } from '@shared/constants';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './database/module';
import { IdentityModule } from './identity/module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CqrsModule.forRoot(),
    LoggerModule.forRoot(
      configurePinoLogger(IS_PRODUCTION, 'IDENTITY-SERVICE'),
    ),

    DatabaseModule,
    IdentityModule,
    RedisModule,
    OtpModule,
    ScheduleModule,
  ],
})
export class AppModule {}
