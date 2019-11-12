import { NextFunction, Request, Response } from 'express';
import errorHandler from './errorHandler';

export default function errorsMiddlewareFactory() {
  return (error: any, req: Request, res: Response, next: NextFunction) => {
    // const logger = req.app.get('logger') as Logger;
    return errorHandler(error, res);
  };
}
