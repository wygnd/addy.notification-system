import { normalizeError } from '@addy/common';
import { Logger } from '@nestjs/common';

/**
 * Декоратор для логирования cron задач
 * @param customJobName
 * @constructor
 */
export function LogCronJob(customJobName?: string): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value,
      name = customJobName ?? String(propertyKey);
    const logger = new Logger(target.constructor.name);

    descriptor.value = async function (...args: any[]) {
      const start = Date.now();
      let end: number;
      let response: unknown;
      let logLevel: 'debug' | 'error' = 'debug';

      try {
        response = await originalMethod.apply(this, args);
      } catch (error) {
        logLevel = 'error';
        response = normalizeError(error);
      } finally {
        end = Date.now();
      }

      logger[logLevel](
        {
          handler: name,
          result: response,
          ts: end - start,
        },
        true,
      );
    };

    return descriptor;
  };
}
