/// <reference path="../index.d.ts" />

import { Request, RequestHandler, Response } from 'express';
import winston from 'winston';
import Sentry from 'winston-sentry-log';
import morgan, { Options } from 'morgan';
import moment from 'moment';
import { createAction } from './elastic';

const morganOptions: Options<Request, Response> = {
  stream: {
    write: (message: string) => {
      global.logger.info(message.trim());
    },
  },
  skip: (request: Request, response: Response) => {
    try {
      if (request.method !== 'OPTIONS') {
        if (!request.elasticsearch) {
          request.elasticsearch = {
            action: 'undefined',
            fields: {},
            tags: [],
            startTime: moment()
              .unix(),
          };
        }
        const { action } = request.elasticsearch;
        const { fields } = request.elasticsearch;
        const { tags } = request.elasticsearch;
        createAction(request, response, action, fields, tags);
      }
    } catch (error) {
      global.logger.error({ error, message: 'Error send elasticsearch event' });
    }
    return false;
  },
};

export class WinstonLogger {
  private logger: winston.Logger;

  private nodeEnv;

  static createMorganMiddleware(nodeEnv: string): RequestHandler {
    const logFormat = nodeEnv === 'production' ? 'combined' : 'dev';
    return morgan(logFormat, morganOptions);
  }

  constructor(nodeEnv:string, service = 'api') {
    this.nodeEnv = nodeEnv;

    // no need to log internal silent logs
    const noSilentLogs = winston.format((log) => (log.silent ? false : { ...log, message: log.message }));

    this.logger = winston.createLogger({
      defaultMeta: { service },
      level: 'info',
      format: winston.format.combine(
        noSilentLogs(),
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        // Add more transporters here if needed
        new winston.transports.Console(),
      ],
    });

    global.logger = this.logger;
  }

  setupSentry(sentryDsn:string): void {
    if (this.nodeEnv === 'production') {
      this.logger.add(
        new Sentry({
          dsn: sentryDsn,
        }),
      );
    }
  }
}
