import {FastifyReply} from 'fastify';
import ApplicationError from '../application/ApplicationError';
import { ErrorCodes } from '../application/declarations';
import ILogger from '../infra/logger/ILogger';
import { getErrorResponse } from './responseGenerator';

export default (err: any, res: FastifyReply, logger: ILogger) => {
  if (err instanceof ApplicationError) {
    if (err.status >= 500) {
      logger.error(err);
    } else {
      logger.debug(err);
    }

    return res.status(err.status).send(getErrorResponse(err.message, err.code, err.status));
  }

  logger.error(err);

  return res.status(500).send(getErrorResponse('Internal Error', ErrorCodes.INTERNAL_ERROR, 500));
};
