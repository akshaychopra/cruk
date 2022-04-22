/// <reference path="../index.d.ts" />
import { Client } from '@elastic/elasticsearch';
import { Request, Response } from 'express';
import moment from 'moment';

let client: Client | null = null;

export function startElasticClient() {
  try {
    // uncomment to enable only on production
    // if (process.env.nodeEnv === 'production') {
    client = new Client({
      cloud: {
        id: process.env.ELASTIC_CLOUD_ID as string,
      },
      auth: {
        username: process.env.ELASTIC_USER || '',
        password: process.env.ELASTIC_PASSWORD || '',
      },
    });
    // }
  } catch (error) {
    global.logger.error(error);
  }
}

export function createAction(
  request: Request,
  response: Response,
  action: string,
  fields: any,
  tags: Array<string>,
): void {
  try {
    const eventMoment = moment();
    const eventDay = eventMoment.format('YYYYMMDD');
    const eventISODate = eventMoment.toISOString();
    const eventUnixTimestamp = eventMoment.unix();

    // client IP
    const ipHeaders = (request.headers['x-forwarded-for'] as string || request.connection.remoteAddress || '');
    const remoteIPs = ipHeaders.split(',');
    const remoteIP = remoteIPs[0];

    if (client) {
      client
        .create({
          // create a different index for each day
          index: `api-events-${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}-${eventDay}`.toLowerCase(),
          id: `${action}-${eventUnixTimestamp}`,
          body: {
            '@timestamp': eventISODate,
            source: {
              hostname: request.hostname,
              name: 'api',
            },
            request: {
              protocol: request.protocol,
              url: `${request.protocol}://${request.hostname}${request.originalUrl}`,
              method: request.method,
              params: request.query,
              status_code: response.statusCode,
              status_message: response.statusMessage,
              ip: remoteIP,
              ips: remoteIPs,
              headers: request.headers,
            },
            action,
            fields,
            tags,
            type: 'api_call',
            environment: process.env.NODE_ENV,
            responseTime: Date.now() - request.elasticsearch.startTime,
          },
        });
    }
  } catch (error: any) {
    global.logger.error({ ...error, message: 'ElasticSearch: Error creating action' });
  }
}
