import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../constants/constants';
import { redisOptions } from '../services/redis.config-factory';

export const redisProviders = [
  {
    provide: REDIS_CLIENT,
    useFactory: async (configService: ConfigService) => {
      const client = new Redis(redisOptions(configService));
      client.on('error', (e) => console.error(`REDIS: Error connecting: ${e}`));
      try {
        await client?.connect?.();
      } catch (error) {
        throw new Error(`REDIS: Failed to connect: ${error}`);
      }
      return client;
    },
    inject: [ConfigService],
  },
];
