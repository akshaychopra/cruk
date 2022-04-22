/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import winston from 'winston';

declare global {
  namespace Express {
    export interface Request {
      // add custom request addons here
      elasticsearch: { action: string, fields: any, tags: any[], startTime: number },
    }
  }
}

declare global {
  var logger: winston.Logger;
}
