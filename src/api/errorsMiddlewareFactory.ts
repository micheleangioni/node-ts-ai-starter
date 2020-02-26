import { NextFunction, Request, Response } from 'express';
import ILogger from '../infra/logger/ILogger';
import errorHandler from './errorHandler';

export default (logger: ILogger) => {
  return (error: any, _req: Request, res: Response, _next: NextFunction) => {
    return errorHandler(error, res, logger);
  };
};
