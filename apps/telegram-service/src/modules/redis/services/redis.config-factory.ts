import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';
import { redisRetryStrategy } from './redis.retry-strategy';

export const redisOptions = (configService: ConfigService): RedisOptions => {
  let totalRetryDuration = 0;

  return {
    host: configService.getOrThrow<string>('REDIS_HOST'),
    port: configService.getOrThrow<number>('REDIS_PORT'),
    username: configService.getOrThrow<string>('REDIS_USER'),
    password: configService.getOrThrow<string>('REDIS_PASSWORD'),
    showFriendlyErrorStack: true,
    lazyConnect: true,
    commandTimeout: 1000,
    family: 0,
    db: configService.getOrThrow<number>('REDIS_DB_NUMBER'),
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      const { delay, retryDuration } = redisRetryStrategy(
        times,
        totalRetryDuration,
      );
      totalRetryDuration = retryDuration;
      return delay;
    },
  };
};
