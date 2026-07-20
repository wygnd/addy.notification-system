import { NestFastifyApplication } from '@nestjs/platform-fastify';

export const setupAppCors = (app: NestFastifyApplication): void => {
  app.enableCors({});
};
