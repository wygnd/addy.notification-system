import { VersioningType } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

export const setupAppVersioning = (app: NestFastifyApplication): void => {
  app.enableVersioning({
    type: VersioningType.URI,
  });
};
