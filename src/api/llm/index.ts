import * as crypto from 'crypto';
import express from 'express';
import multer from 'multer';
import {SaveableVectorStore} from 'langchain/dist/vectorstores/base';
import {OpenAIEmbeddings} from 'langchain/embeddings/openai';
import {HNSWLib} from 'langchain/vectorstores/hnswlib';
import ILogger from '../../infra/logger/ILogger';
import errorHandler from '../errorHandler';
import {SendMessageCommandHandler} from '../../application/llm/eventHandlers/sendMessageCommandHandler';
import {SendMessageCommand} from '../../application/llm/commands/sendMessageCommand';
import ApplicationError from '../../application/ApplicationError';
import config from '../../config';
import {ErrorCodes} from '../../application/declarations';
import {
  LoadFileIntoVectorStoreCommandHandler,
} from '../../application/llm/eventHandlers/loadFileIntoVectorStoreCommandHandler';
import {LoadFileIntoVectorStoreCommand} from '../../application/llm/commands/loadFileIntoVectorStoreCommand';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});

const generateRandomString = (length: number) =>
  [...crypto.getRandomValues(new Uint8Array(length))].map(x => String.fromCharCode(x)).join('');

let vectorStore: SaveableVectorStore;
const vectorStoreFolder = `./${config.llm.vectorStore.hnswlib.folder}`;

// Setting up the Vector Store persistence should happen in the infrastructure layer
// Being done here to simplify the removal of the AI code in case it's not needed in a new project
// It might/should be improved later
const loadVectorStore = async () => {
  if (vectorStore) {
    return vectorStore;
  }

  switch (process.env.VECTOR_STORE?.toString()) {
    case 'hnswlib':
    default:

      try {
        vectorStore = await HNSWLib.load(vectorStoreFolder, new OpenAIEmbeddings());
      } catch (e) {
        vectorStore = await HNSWLib.fromTexts([], [], new OpenAIEmbeddings());
        await vectorStore.save(vectorStoreFolder);
      }

      break;
  }

  return vectorStore;
};

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

  router.post(
    '/search/load',
    upload.single('file'),
    async (req, res) => {
      if (!req.file) {
        return errorHandler(new ApplicationError({
          code: ErrorCodes.INVALID_DATA,
          error: 'Uploaded file not found',
          status: 412,
        }), res, logger);
      }

      const loadedVectorStore = await loadVectorStore();

      try {
        await (new LoadFileIntoVectorStoreCommandHandler(loadedVectorStore, vectorStoreFolder))
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
