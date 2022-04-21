import { Response } from 'express';

export class BadRequestError extends Error {
  status: number;

  constructor(options: any) {
    super(options.message);
    this.name = this.constructor.name;
    this.status = options.status || 500;
  }
}

export default function ErrorResponse(error: any, response: Response): Response {
  const message = error.message || 'Something went wrong, please try again';
  const errorStatus = error.status || 500;
  return response.status(errorStatus)
    .json({ message })
    .end();
}
