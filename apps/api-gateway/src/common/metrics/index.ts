import { NestFastifyApplication } from '@nestjs/platform-fastify';
import metrics from 'fastify-metrics';

export const setupAppMetrics = async (app: NestFastifyApplication) => {
  const fastifyInstance = app.getHttpAdapter().getInstance();

  await fastifyInstance.register(metrics, {
    endpoint: '/metrics',
  });
};
