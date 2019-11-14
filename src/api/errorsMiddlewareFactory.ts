import { NextFunction, Request, Response } from 'express';
import ILogger from '../infra/logger/ILogger';
import errorHandler from './errorHandler';

export default function errorsMiddlewareFactory(logger: ILogger) {
  return (error: any, req: Request, res: Response, next: NextFunction) => {
    return errorHandler(error, res, logger);
  };
}
