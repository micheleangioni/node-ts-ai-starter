import { Response } from 'express';
import ApplicationError from '../application/ApplicationError';
import { ErrorCodes } from '../application/declarations';
import ILogger from '../infra/logger/ILogger';
import { getErrorResponse } from './responseGenerator';

export default (err: any, res: Response, logger: ILogger) => {
  if (err instanceof ApplicationError) {
    if (err.status >= 500) {
      logger.error(err);
    } else {
      logger.debug(err);
    }

    return res.status(err.status).json(getErrorResponse(err.message, err.code, err.status));
  }

  logger.error(err);

  return res.status(500).json(getErrorResponse('Internal Error', ErrorCodes.INTERNAL_ERROR, 500));
};
