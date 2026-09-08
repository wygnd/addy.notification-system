import { AppModule } from '@modules/module';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ExceptionsToRpcFilter } from '@shared/exceptions';
import { Logger } from 'nestjs-pino';
import { connectAndStartAppMicroservices } from './common/microservices';

async function bootstrap() {
  const adapter = new FastifyAdapter({ logger: false });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    { bufferLogs: true },
  );

  const logger = app.get(Logger);

  app.useLogger(logger);

  app.useGlobalFilters(new ExceptionsToRpcFilter());

  // Подключаем микросервисы
  await connectAndStartAppMicroservices(app);

  await app.listen(3000);
}
bootstrap();
