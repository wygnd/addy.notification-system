import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisProviders } from './providers/providers';
import { RedisService } from './services/service';

@Module({
  imports: [ConfigModule],
  providers: [...redisProviders, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
