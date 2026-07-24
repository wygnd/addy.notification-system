import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

export const connectAndStartAppMicroservices = async (
  app: NestFastifyApplication,
) => {
  const config = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RABBITMQ_URL')],
      queue: config.getOrThrow<string>('RABBITMQ_QUEUE_NAME'),
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

  await app.startAllMicroservices();
};
