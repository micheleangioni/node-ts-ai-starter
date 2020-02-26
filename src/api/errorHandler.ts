import { Response } from 'express';
import ApplicationError from '../application/ApplicationError';
import { ErrorCodes } from '../application/declarations';
import ILogger from '../infra/logger/ILogger';
import { getErrorResponse } from './responseGenerator';

export default (error: any, res: Response, logger: ILogger) => {
  if (error instanceof ApplicationError) {
    if (error.status >= 500) {
      logger.error(error);
    }

    return res.status(error.status).json(getErrorResponse(error.message, error.code));
  }

  logger.error(error.toString());

  return res.status(500).json(getErrorResponse('Internal Error', ErrorCodes.INTERNAL_ERROR, 500));
};
