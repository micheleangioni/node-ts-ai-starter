import { ApplicationErrorData } from './declarations';

export default class ApplicationError extends Error {
  public readonly code: string;
  public readonly error?: Error;
  public readonly message: string;
  public readonly status: number;
  public readonly stack?: string;

  constructor({ code, error, status }: ApplicationErrorData) {
    super(typeof error === 'string' ? error : error.message);

    this.code = code;
    this.message = typeof error === 'string' ? error : error.message.toString();
    this.status = status;
  }

  public toString(): string {
    return JSON.stringify({
      code: this.code,
      message: this.message,
      statusCode: this.status,
      ...(this.stack && { stack: this.stack }),
    });
  }
}
