import * as crypto from 'crypto';
import express from 'express';
import multer from 'multer';
import errorHandler from '../errorHandler';
import {SendMessageCommandHandler} from '../../application/llm/eventHandlers/sendMessageCommandHandler';
import {SendMessageCommand} from '../../application/llm/commands/sendMessageCommand';
import ApplicationError from '../../application/ApplicationError';
import {ErrorCodes} from '../../application/declarations';
import {
  LoadFileIntoVectorStoreCommandHandler,
} from '../../application/llm/eventHandlers/loadFileIntoVectorStoreCommandHandler';
import {LoadFileIntoVectorStoreCommand} from '../../application/llm/commands/loadFileIntoVectorStoreCommand';
import {CleanVectorStoreCommandHandler} from '../../application/llm/eventHandlers/cleanVectorStoreCommandHandler';
import {QueryDocsQueryHandler} from '../../application/llm/eventHandlers/queryDocsQueryHandler';
import {QueryDocsQuery} from '../../application/llm/queries/queryDocsQuery';
import ILogger from '../../infra/logger/ILogger';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});

const generateRandomString = (length: number) =>
  [...crypto.getRandomValues(new Uint8Array(length))].map(x => String.fromCharCode(x)).join('');

export default (app: express.Application, _source: string) => {
  const logger = app.get('logger') as ILogger;

  // <--- CHAT ENDPOINTS --- >

  /**
   * Send a message to the llm.
   */
  router.post('/chat/message', async (req, res) => {
    const { message } = req.body;

    if (
      typeof message !== 'string'
    ) {
      return errorHandler(new ApplicationError({
        code: ErrorCodes.INVALID_DATA,
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

  // <--- SEARCH ENDPOINTS --- >

  router.get(
    '/search/documents',
    async (req, res) => {
      if (typeof req.query.query !== 'string') {
        return errorHandler(new ApplicationError({
          code: ErrorCodes.INVALID_DATA,
          error: 'Query parameter `query` not provided',
          status: 412,
        }), res, logger);
      }

      try {
        const response = await (new QueryDocsQueryHandler({}))
          .handle(new QueryDocsQuery({
            query: req.query.query,
          }));

        res.json({
          data: response,
        });
      } catch (err) {
        return errorHandler(err, res, logger);
      }
    });

  router.post(
    '/search/documents',
    upload.single('file'),
    async (req, res) => {
      if (!req.file) {
        return errorHandler(new ApplicationError({
          code: ErrorCodes.INVALID_DATA,
          error: 'Uploaded file not found',
          status: 412,
        }), res, logger);
      }

      try {
        await (new LoadFileIntoVectorStoreCommandHandler())
          .handle(new LoadFileIntoVectorStoreCommand({
            buffer: req.file.buffer,
            fileName: req.file.filename,
            mimetype: req.file.mimetype,
          }));

        res.json({
          data: 'File successfully loaded into the Vector Store',
        });
      } catch (err) {
        return errorHandler(err, res, logger);
      }
    });

  router.delete(
    '/search/documents',
    async (_req, res) => {
      try {
        await (new CleanVectorStoreCommandHandler())
          .handle();

        res.json({
          data: 'Vector Store successfully cleaned',
        });
      } catch (err) {
        return errorHandler(err, res, logger);
      }
    });

  return router;
};
