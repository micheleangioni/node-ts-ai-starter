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
import {QueryDocsQueryHandler} from '../../application/llm/eventHandlers/queryDocsQueryHandler';
import {QueryDocsQuery} from '../../application/llm/queries/queryDocsQuery';
import {loadVectorStore} from '../../infra/llm/vectorStore';
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

      const loadedVectorStore = await loadVectorStore();

      try {
        const response = await (new QueryDocsQueryHandler({vectorStore: loadedVectorStore}))
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
    '/search/load-document',
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

  return router;
};
