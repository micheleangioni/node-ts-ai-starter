import * as shell from 'shelljs';
import {Document} from 'langchain/document';
import {OpenAIEmbeddings} from 'langchain/embeddings/openai';
import {SaveableVectorStore} from 'langchain/vectorstores/base';
import {HNSWLib} from 'langchain/vectorstores/hnswlib';
import {MemoryVectorStore} from 'langchain/vectorstores/memory';
import {RedisVectorStore} from 'langchain/vectorstores/redis';
import config from '../../config';
import {VectorStore} from 'langchain/dist/vectorstores/base';
import connectToRedis from './connectToRedis';
import ApplicationError from '../../application/ApplicationError';
import {ErrorCodes} from '../../application/declarations';

// The Vector store can be a saveable one (eg. memory) or not (eg. Redis)
let vectorStore: SaveableVectorStore | VectorStore;
const vectorStoreFolder = `./${config.llm.vectorStore.hnswlib.folder}`;

export const addDocumentsToVectorStore = async (docs: Document[]) => await vectorStore.addDocuments(docs);

export const loadVectorStore = async (forceReload: boolean = false) => {
  if (forceReload && vectorStore) {
    return vectorStore;
  }

  switch (process.env.VECTOR_STORE?.toString()) {
    case 'memory':
      vectorStore = await MemoryVectorStore.fromTexts(['Initialising'], [], new OpenAIEmbeddings());
      break;
    case 'redis':
      // eslint-disable-next-line no-case-declarations
      const redisClient = await connectToRedis();

      vectorStore = await RedisVectorStore.fromTexts(
        ['Initialising'],
        [],
        new OpenAIEmbeddings(),
        {
          indexName: 'docs',
          redisClient,
        },
      );
      break;
    case 'hnswlib':
    default:
      try {
        vectorStore = await HNSWLib.load(vectorStoreFolder, new OpenAIEmbeddings());
      } catch (e) {
        vectorStore = await HNSWLib.fromTexts(['Initialising'], [], new OpenAIEmbeddings());

        if (vectorStore instanceof SaveableVectorStore) {
          await vectorStore.save(vectorStoreFolder);
        }
      }

      break;
  }

  return vectorStore;
};

export const persistVectorStore = async () => {
  if (vectorStore instanceof SaveableVectorStore) {
    await vectorStore.save(vectorStoreFolder);
  }
};

/**
 * Delete all the data previously loaded into the Vector Store.
 * The strategy to achieve it changes depending on the type of Vector Store.
 */
export const cleanVectorStore = async () => {
  await loadVectorStore();

  if (vectorStore instanceof MemoryVectorStore) {
    await loadVectorStore(true);

    return;
  }

  if (vectorStore instanceof RedisVectorStore) {
    const redisClient = await connectToRedis();

    await redisClient.flushDb();

    return;
  }

  if (vectorStore instanceof HNSWLib) {
    if (shell.test('-f', 'storage/docstore.json')) {
      shell.rm('storage/docstore.json');
    }

    if (shell.test('-f', 'storage/hnswlib.index')) {
      shell.rm('storage/hnswlib.index');
    }

    await loadVectorStore(true);

    return;
  }

  throw new ApplicationError({
    code: ErrorCodes.INTERNAL_ERROR,
    error: 'Invalid Vector Store',
    status: 500,
  });
};
