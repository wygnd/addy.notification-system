import { RedisModule } from '@modules/redis/module';
import { TelegramModule } from '@modules/telegram/module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), RedisModule, TelegramModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
