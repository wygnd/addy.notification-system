import { AppModule } from '@modules/module';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExceptionsToRpcFilter } from '@shared/exceptions';

async function bootstrap() {
  const rabbitMQUrl = process.env.RABBITMQ_URL;
  const rabbitMQQueueName = process.env.RABBITMQ_QUEUE_NAME;

  if (!rabbitMQUrl) {
    throw new Error('Invalid RabbitMQ URL');
  }

  if (!rabbitMQQueueName) {
    throw new Error('Invalid RabbitMQ queue name');
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
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
    },
  );

  app.useGlobalFilters(new ExceptionsToRpcFilter());

  await app.listen();
}
bootstrap();
