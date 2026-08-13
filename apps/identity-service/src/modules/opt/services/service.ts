import { REDIS_KEYS } from '@modules/redis/constants/constants';
import { RedisService } from '@modules/redis/services/service';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';

@Injectable()
export class OtpService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Сохраняет код в кеш
   * @param {string} identity - Идентификатор
   * @param payload
   * @public
   */
  public async create(
    identity: string,
    payload: unknown = null,
  ): Promise<string> {
    const { code, hash } = await this.generate();

    console.log('check code', code, hash);

    await this.redisService.set<unknown>(
      REDIS_KEYS.CLIENT_CONNECT + `${identity}:${code}`,
      payload,
      600,
    );

    return code;
  }

  /**
   * Валидирует код
   * @param {string} identity - Идентификатор
   * @param {number} inputCode - Код, который ввел пользователь
   */
  public async verify(identity: string, inputCode: string): Promise<string> {
    const normalizeCode = inputCode.toUpperCase().replace(/\s./g, '');
    const rateLimitRedisKey =
      REDIS_KEYS.CLIENT_CONNECT_VERIFY_LIMIT + `${identity}:${inputCode}`;

    const attempts = await this.redisService.incr(rateLimitRedisKey);

    await this.redisService.expire(rateLimitRedisKey, 300);

    if (attempts > 3) {
      throw new Error('Слишком много попыток. Пожалуйста, попробуйте позже.');
    }

    const redisKey = REDIS_KEYS.CLIENT_CONNECT + `${identity}:${normalizeCode}`;

    const userId = await this.redisService.get<string>(redisKey);

    if (!userId) {
      throw new Error('Неверный код или срок активации истек');
    }

    // Инвалидируем код
    await Promise.all([
      this.redisService.del(REDIS_KEYS.CLIENT_CONNECT + identity),
      this.redisService.del(rateLimitRedisKey),
    ]);

    return userId;
  }

  /**
   * Генерирует шести значный код и его хешированную версию
   * @private
   *
   */
  private async generate() {
    const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    const random = randomBytes(6);
    let code = '';

    for (let i = 0; i < 6; i++) {
      code += alphabet[random[i] % alphabet.length];
    }

    code = `${code.slice(0, 3)}-${code.slice(3)}`; // "A3F-7K9" для читаемости

    const hash = await bcrypt.hash(String(code), 10);

    return { code, hash };
  }
}
