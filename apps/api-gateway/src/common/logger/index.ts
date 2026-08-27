import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';

export const setupAppLogging = (app: NestFastifyApplication) => {
  app.useLogger(app.get(Logger));
};
