import * as crypto from 'crypto';
import express from 'express';
const router = express.Router();
import ILogger from '../../infra/logger/ILogger';
import errorHandler from '../errorHandler';
import {SendMessageCommandHandler} from '../../application/chat/eventHandlers/sendMessageCommandHandler';
import {SendMessageCommand} from '../../application/chat/commands/sendMessageCommand';
import ApplicationError from '../../application/ApplicationError';

const generateRandomString = (length: number) =>
  [...crypto.getRandomValues(new Uint8Array(length))].map(x => String.fromCharCode(x)).join('');

export default (app: express.Application, _source: string) => {
  const logger = app.get('logger') as ILogger;

  /**
   * Send a message to the chat.
   */
  router.post('/message', async (req, res) => {
    const { message } = req.body;

    if (
      typeof message !== 'string'
    ) {
      return errorHandler(new ApplicationError({
        code: 'INVALID_INPUT',
        error: 'Missing or invalid `message` input parameter',
        status: 412,
      }), res, logger);
    }

    // As authentication is not required, use IP Address as the user unique identifier
    const userId = req.socket.remoteAddress ?? generateRandomString(16);

    try {
      const response = await (new SendMessageCommandHandler())
        .handle(new SendMessageCommand({message, userId}));

      res.json({
        data: response,
      });
    } catch (err) {
      return errorHandler(err, res, logger);
    }
  });

  return router;
};
