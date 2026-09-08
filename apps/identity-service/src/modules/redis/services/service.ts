import { normalizeError } from '@addy/common';
import { Inject, Injectable } from '@nestjs/common';
import { isJSON, isString } from 'class-validator';
import Redis from 'ioredis';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { REDIS_CLIENT } from '../constants/constants';

@Injectable()
export class RedisService {
  constructor(
    @InjectPinoLogger(RedisService.name)
    private readonly logger: PinoLogger,

    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  public async set<T>(key: string, value: T, ttlSecond?: number) {
    try {
      ttlSecond
        ? await this.redisClient.set(
            key,
            isString(value) ? value : JSON.stringify(value),
            'EX',
            ttlSecond,
          )
        : await this.redisClient.set(
            key,
            isString(value) ? value : JSON.stringify(value),
          );
      return true;
    } catch {
      return false;
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);

    if (!data) return null;

    return isJSON(data) ? (JSON.parse(data) as T) : (data as T);
  }

  public async del(key: string) {
    return this.redisClient.del(key);
  }

  public async incr(key: string) {
    return this.redisClient.incr(key);
  }

  public async expire(key: string, seconds: number) {
    await this.redisClient.expire(key, seconds);
  }

  public async isInit(): Promise<boolean> {
    try {
      const pong = await this.redisClient.ping();

      return pong === 'PONG';
    } catch (error) {
      this.logger.error({
        handler: this.isInit.name,
        error: normalizeError(error),
      });

      return false;
    }
  }
}
