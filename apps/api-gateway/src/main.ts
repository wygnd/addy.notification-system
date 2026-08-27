import { setupAppCors } from '@common/cors';
import { setupAppDocs } from '@common/documentation';
import { setupAppFilters } from '@common/filters';
import { setupAppLogging } from '@common/logger';
import { connectAppMicroservices } from '@common/microservices';
import { setupAppPipes } from '@common/pipes';
import { setupAppVersioning } from '@common/versioning';
import { AppModule } from '@modules/module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const adapter = new FastifyAdapter({ logger: false });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    { bufferLogs: true },
  );
  const config = app.get(ConfigService);
  const logger = new Logger('Application');
  const PORT = config.get<number>('PORT') ?? 3000;

  // Формируем версионирование для эндпоинтов
  setupAppVersioning(app);

  // Добавляем CORS
  setupAppCors(app);

  // Формируем фильтры
  setupAppFilters(app);

  // Формируем PIPES
  setupAppPipes(app);

  // Формируем документацию
  setupAppDocs(app);

  // Изменяем логирование системы
  setupAppLogging(app);

  // Подключаем микросервисы
  await connectAppMicroservices(app);

  await app.listen(PORT, '0.0.0.0');
  logger.log(`Server started http://0.0.0.0:${PORT}`);
}

bootstrap();
