import {HNSWLib} from 'langchain/vectorstores/hnswlib';
import {OpenAIEmbeddings} from 'langchain/embeddings/openai';
import {SaveableVectorStore} from 'langchain/dist/vectorstores/base';
import config from '../../config';
import {Document} from 'langchain/document';

let vectorStore: SaveableVectorStore;
const vectorStoreFolder = `./${config.llm.vectorStore.hnswlib.folder}`;

export const addDocumentsToVectorStore = async (docs: Document[]) => await vectorStore.addDocuments(docs);

export const loadVectorStore = async () => {
  if (vectorStore) {
    return vectorStore;
  }

  switch (process.env.VECTOR_STORE?.toString()) {
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

export const persistVectorStore = async () => await vectorStore.save(vectorStoreFolder);
