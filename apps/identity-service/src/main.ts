import { NestFactory } from '@nestjs/core';
import { AppModule } from '@modules/module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ExceptionsToRpcFilter } from '@shared/exceptions';

async function bootstrap() {
  const rabbitMQUrl = process.env.RABBITMQ_URL;

  if (!rabbitMQUrl) {
    throw new Error('RABBITMQ URL is required');
  }

  const rabbitMQQueueName = process.env.RABBITMQ_QUEUE_NAME;

  if (!rabbitMQQueueName) {
    throw new Error('RABBITMQ queue name is required');
  }

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQUrl],
      queue: rabbitMQQueueName,
      queueOptions: {
        durable: true,
        autoDelete: false,
        arguments: {
          'x-dead-letter-exchange': 'notifications.dlx', // куда падают сообщения, которые не смогли обработать/протухли
          'x-dead-letter-routing-key': 'failed-notifications',
          'x-max-priority': 10, // включает приоритеты сообщений (0-10)
        },
      },
      noAck: false, // Сообщение не будет удаляться из очереди до успешного подтверждения
      prefetchCount: 10, // Кол-во одновременных обработок сообщений брокером
    },
  });

  app.useGlobalFilters(new ExceptionsToRpcFilter());

  const logger = new Logger('Application');

  await app.listen();
  logger.log('Application successfully started');
}

bootstrap();
