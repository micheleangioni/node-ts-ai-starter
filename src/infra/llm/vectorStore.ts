import {Document} from 'langchain/document';
import {OpenAIEmbeddings} from 'langchain/embeddings/openai';
import {SaveableVectorStore} from 'langchain/vectorstores/base';
import {HNSWLib} from 'langchain/vectorstores/hnswlib';
import {MemoryVectorStore} from 'langchain/vectorstores/memory';
import {RedisVectorStore} from 'langchain/vectorstores/redis';
import {createClient} from 'redis';
import config from '../../config';
import {VectorStore} from 'langchain/dist/vectorstores/base';

// The Vector store can be a saveable one (eg. memory) or not (eg. Redis)
let vectorStore: SaveableVectorStore | VectorStore;
const vectorStoreFolder = `./${config.llm.vectorStore.hnswlib.folder}`;

export const addDocumentsToVectorStore = async (docs: Document[]) => await vectorStore.addDocuments(docs);

export const loadVectorStore = async () => {
  if (vectorStore) {
    return vectorStore;
  }

  switch (process.env.VECTOR_STORE?.toString()) {
    case 'memory':
      vectorStore = await MemoryVectorStore.fromTexts(['Initialising'], [], new OpenAIEmbeddings());
      break;
    case 'redis':
      // eslint-disable-next-line no-case-declarations
      const redisClient = createClient({
        url: process.env.REDIS_URL ?? 'redis://localhost:6379',
      });

      await redisClient.connect();

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
