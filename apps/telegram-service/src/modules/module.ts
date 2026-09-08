import { configurePinoLogger } from '@addy/common';
import { RedisModule } from '@modules/redis/module';
import { TelegramModule } from '@modules/telegram/module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IS_PRODUCTION } from '@shared/constants';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: ['.env'],
    }),
    LoggerModule.forRoot(configurePinoLogger(IS_PRODUCTION, 'TELEGRAM-SERVICE')),

    RedisModule,
    TelegramModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
