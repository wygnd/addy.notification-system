import { normalizeError } from '@src/utils';
import { Params } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

export const configurePinoLogger = (isProduction: boolean = false): Params => ({
  pinoHttp: {
    messageKey: 'message',
    transport: isProduction
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
            messageKey: 'message',
          },
        },
    level: isProduction ? 'info' : 'debug',
    formatters: {
      level: (label) => ({ label }),
    },
    genReqId: (req) => req.headers['x-request-id']?.toString() ?? randomUUID(),
    autoLogging: true,
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    customProps: (req) => ({
      request_id: req.headers['x-request-id'],
      environment: isProduction ? 'production' : 'development',
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
    serializers: {
      req: (request) => ({
        id: request.headers['x-request-id'],
        method: request.method,
        url: request.url,
        query: request.query,
        body: request.raw.body,
        headers: request.headers,
        hostname: request.hostname,
        ip: request.ip,
        remote_address: request.remoteAddress,
        remote_port: request.remotePort,
      }),
    },
    base: {
      service: 'GATEWAY',
    },
  },
});
