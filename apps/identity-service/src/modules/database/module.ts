import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: configService.getOrThrow<number>('DB_PORT'),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        database: configService.getOrThrow<string>('DB_NAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        autoLoadModels: true,
        synchronize: true,
      }),
      imports: [ConfigModule],
    }),
  ],
})
export class DatabaseModule {}
