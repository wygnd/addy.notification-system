import { AppModule } from '@modules/module';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ExceptionsToRpcFilter } from '@shared/exceptions';
import { connectAndStartAppMicroservices } from './common/microservices';

async function bootstrap() {
  const adapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  app.useGlobalFilters(new ExceptionsToRpcFilter());

  // Подключаем микросервисы
  await connectAndStartAppMicroservices(app);

  await app.listen(3000);
}
bootstrap();
