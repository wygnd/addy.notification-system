import { NestFactory } from '@nestjs/core';
import { AppModule } from '@modules/module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupAppDocs } from '@common/documentation';
import { setupAppVersioning } from '@common/versioning';
import { setupAppPipes } from '@common/pipes';
import { setupAppCors } from '@common/cors';
import { setupAppFilters } from '@common/filters';

async function bootstrap() {
  const adapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );
  const config = app.get(ConfigService);
  const logger = new Logger('Application');
  const PORT = config.get<number>('PORT') ?? 3000;

  // Формируем документацию
  setupAppDocs(app);

  // Формируем версионирование для эндпоинтов
  setupAppVersioning(app);

  // Формируем PIPES
  setupAppPipes(app);

  // Добавляем CORS
  setupAppCors(app);

  // Формируем фильтры
  setupAppFilters(app);

  await app.listen(PORT, '0.0.0.0');
  logger.log(`Server started http://0.0.0.0:${PORT}`);
}

bootstrap();
