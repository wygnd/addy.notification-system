import { DatabaseModule } from '@modules/database/module';
import { HealthModule } from '@modules/health/module';
import { IdentityModule } from '@modules/identity/module';
import { NotificationModule } from '@modules/notifications/module';
import { RedisModule } from '@modules/redis/module';
import { UsersModule } from '@modules/users/module';
import { VkModule } from '@modules/vk/module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ServeStaticModule } from '@nestjs/serve-static';
import { IS_PRODUCTION } from '@shared/constants';
import { TransformErrorFilter } from '@shared/filters';
import { AuthGuard } from '@shared/guards';
import { TransformSuccessResponseInterceptor } from '@shared/interceptors';
import { RpcExceptionInterceptor } from '@shared/interceptors/exception';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    CqrsModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      exclude: ['/api/*'],
      serveStaticOptions: {
        cacheControl: true,
      },
      serveRoot: '/',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: IS_PRODUCTION
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
              },
            },
        level: IS_PRODUCTION ? 'info' : 'debug',
        genReqId: (req) =>
          req.headers['x-request-id']?.toString() ?? randomUUID(),
        autoLogging: true,
        timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
        customProps: (req) => ({
          request_id: req.id,
          environment: IS_PRODUCTION ? 'production' : 'development',
        }),
        customReceivedObject: (req) => ({
          method: req.method,
          path: req.url,
        }),
        customSuccessObject: (req, res) => ({
          method: req.method,
          path: req.url,
          status_code: res.statusCode,
        }),
        customErrorObject: (req, res, error) => ({
          method: req.method,
          path: req.url,
          status_code: res.statusCode,
          error,
        }),
        base: {
          service: 'GATEWAY',
        },
      },
      forRoutes: ['/'],
    }),

    HealthModule,
    DatabaseModule,
    NotificationModule,
    VkModule,
    IdentityModule,
    RedisModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: RpcExceptionInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformSuccessResponseInterceptor },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: TransformErrorFilter },
  ],
})
export class AppModule {}
