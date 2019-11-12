import { ApplicationErrorData, ErrorCodes } from './declarations';

export default class ApplicationError extends Error {
  public code: string;
  public message: string;
  public status: number;

  constructor({ code, message, status }: ApplicationErrorData) {
    super(message);

    this.code = code || ErrorCodes.INTERNAL_ERROR;
    this.message = message || 'InternalError';
    this.status = status || 500;
  }
}
