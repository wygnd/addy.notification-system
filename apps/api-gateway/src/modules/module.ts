import { normalizeError } from '@addy/common';
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
    LoggerModule.forRoot({
      pinoHttp: {
        messageKey: 'message',
        transport: IS_PRODUCTION
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                messageKey: 'message',
              },
            },
        level: IS_PRODUCTION ? 'info' : 'debug',
        formatters: {
          level: (label) => ({ label }),
        },
        genReqId: (req) =>
          req.headers['x-request-id']?.toString() ?? randomUUID(),
        autoLogging: true,
        timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
        customProps: (req) => ({
          request_id: req.id,
          environment: IS_PRODUCTION ? 'production' : 'development',
          body: (req as any).body,
        }),
        customReceivedObject: (req) => ({
          type: 'REQUEST',
          method: req.method,
          path: req.url,
        }),
        customSuccessObject: (req, res) => ({
          type: 'RESPONSE',
          method: req.method,
          path: req.url,
          status_code: res.statusCode,
        }),
        customErrorObject: (req, res, error) => {
          const { message, statusCode, code } = normalizeError(error);

          return {
            type: 'ERROR',
            method: req.method,
            path: req.url,
            status_code: statusCode,
            error_code: code,
            error_message: message,
          };
        },
        base: {
          service: 'GATEWAY',
        },
      },
    }),

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
