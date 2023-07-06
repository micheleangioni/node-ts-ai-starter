import {Document} from 'langchain/document';
import {OpenAIEmbeddings} from 'langchain/embeddings/openai';
import {SaveableVectorStore} from 'langchain/vectorstores/base';
import {HNSWLib} from 'langchain/vectorstores/hnswlib';
import {MemoryVectorStore} from 'langchain/vectorstores/memory';
import config from '../../config';

// The Vector store can be a memory-based one, i.e. cannot be persisted, or a persistable one
let vectorStore: SaveableVectorStore | MemoryVectorStore;
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
    case 'hnswlib':
    default:
      try {
        vectorStore = await HNSWLib.load(vectorStoreFolder, new OpenAIEmbeddings());
      } catch (e) {
        vectorStore = await HNSWLib.fromTexts(['Initialising'], [], new OpenAIEmbeddings());
        await vectorStore.save(vectorStoreFolder);
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
