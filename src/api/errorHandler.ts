import { Response } from 'express';
import ApplicationError from '../application/ApplicationError';
import { ErrorCodes } from '../application/declarations';
import { getErrorResponse } from './responseGenerator';

export default function errorHandler(error: any, res: Response) {
  if (error instanceof ApplicationError) {
    if (error.status >= 500) {
      console.error(error);
    }

    return res.status(error.status).json(getErrorResponse(error.message, error.code));
  }

  console.error(error);

  return res.status(500).json(getErrorResponse('Internal Error', ErrorCodes.INTERNAL_ERROR, 500));
}
