import * as crypto from 'crypto';
import {FastifyInstance} from 'fastify';
import {FromSchema} from 'json-schema-to-ts';
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

const generateRandomString = (length: number) =>
  [...crypto.getRandomValues(new Uint8Array(length))].map(x => String.fromCharCode(x)).join('');

export default (app: FastifyInstance, source: string) => {
  // @see https://github.com/fastify/fastify-multipart
  app.register(require('@fastify/multipart'), {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 100, // Max field value size in bytes
      fields: 10, // Max number of non-file fields
      fileSize: 100000000, // For multipart forms, the max file size in bytes
      files: 1, // Max number of file fields
      headerPairs: 2000, // Max number of header key=>value pairs
      parts: 1000, // For multipart forms, the max number of parts (fields + files)
    },
  });
  const logger = app.log;

  // <--- CHAT ENDPOINTS --- >

  const postChatMessageBody = {
    properties: {
      message: {
        type: 'string',
      },
    },
    required: ['message'],
    type: 'object',
  } as const;

  /**
   * Send a message to the llm.
   */
  app.post<{ Body: FromSchema<typeof postChatMessageBody> }>(
    `${source}/chat/message`, {
      schema: {
        body: postChatMessageBody,
      }}, async (req, res) => {
      const { message } = req.body;

      // As authentication is not required, use IP Address as the user unique identifier
      const userId = req.socket.remoteAddress ?? generateRandomString(16);

      try {
        const response = await (new SendMessageCommandHandler())
          .handle(new SendMessageCommand({message, userId}));

        res.status(201).send({
          data: response,
        });
      } catch (err) {
        return errorHandler(err, res, logger);
      }
    });

  // <--- SEARCH ENDPOINTS --- >

  const getSearchDocumentsQuery = {
    properties: {
      query: {
        type: 'string',
      },
    },
    required: ['query'],
    type: 'object',
  } as const;

  app.get<{ Querystring: FromSchema<typeof getSearchDocumentsQuery> }>(
    `${source}/search/documents`,
    {
      schema: {
        querystring: getSearchDocumentsQuery,
      }},
    async (req, res) => {
      try {
        const response = await (new QueryDocsQueryHandler({}))
          .handle(new QueryDocsQuery({
            query: req.query.query,
          }));

        res.send({
          data: response,
        });
      } catch (err) {
        return errorHandler(err, res, logger);
      }
    });

  app.post(
    `${source}/search/documents`,
    async (req, res) => {
      // @ts-ignore
      const file = await req.file();

      if (!file) {
        return errorHandler(new ApplicationError({
          code: ErrorCodes.INVALID_DATA,
          error: 'Uploaded file not found',
          status: 412,
        }), res, logger);
      }

      try {
        await (new LoadFileIntoVectorStoreCommandHandler())
          .handle(new LoadFileIntoVectorStoreCommand({
            buffer: await file.toBuffer(),
            fileName: file.filename,
            mimetype: file.mimetype,
          }));

        res.send({
          data: 'File successfully loaded into the Vector Store',
        });
      } catch (err) {
        return errorHandler(err, res, logger);
      }
    });

  app.delete(
    `${source}/search/documents`,
    async (_req, res) => {
      try {
        await (new CleanVectorStoreCommandHandler())
          .handle();

        res.send({
          data: 'Vector Store successfully cleaned',
        });
      } catch (err) {
        return errorHandler(err, res, logger);
      }
    });

  return app;
};
