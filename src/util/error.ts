import { Response } from 'express';

export class BadRequestError extends Error {
  status: number;

  silent: boolean;

  constructor(options: any) {
    super(options.message);
    this.name = this.constructor.name;
    this.status = options.status || 500;
    this.silent = options.silent ?? false;
  }
}

export default function ErrorResponse(error: any, response: Response): Response {
  const message = error.message || 'Something went wrong, please try again';
  const errorStatus = error.status || 500;
  global.logger.error(error);
  return response.status(errorStatus)
    .json({ message })
    .end();
}
