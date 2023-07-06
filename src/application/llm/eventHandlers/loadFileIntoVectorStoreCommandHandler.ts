import {Document} from 'langchain/document';
import {CharacterTextSplitter} from 'langchain/text_splitter';
import {LoadFileIntoVectorStoreCommand} from '../commands/loadFileIntoVectorStoreCommand';
import config from '../../../config';
import IHandler from '../../IHandler';
import {addDocumentsToVectorStore, loadVectorStore, persistVectorStore} from '../../../infra/llm/vectorStore';

const {chunkOverlap, chunkSize} = config.llm.fileLoading;

export class LoadFileIntoVectorStoreCommandHandler implements IHandler {
  async handle({ buffer, fileName, mimetype }: LoadFileIntoVectorStoreCommand): Promise<void> {
    // Ideally the Vector Store should be loaded at infra level in src/infra/index.ts
    await loadVectorStore();

    // TODO Missing: check whether a previously added file is trying to be added
    // A uploaded files db is needed

    // Split input document into chunks
    const textSplitter = new CharacterTextSplitter({
      chunkOverlap,
      chunkSize,
    });
    const texts = await textSplitter.splitText(buffer.toString());

    // Create Documents from the text chunks
    const docs = texts.map((text, index) => {
      return new Document({
        metadata: {
          chunk: index,
          mimetype,
          name: fileName,
        },
        pageContent: text,
      });
    });

    // Save the docs into the vector store
    await addDocumentsToVectorStore(docs);

    // Persist it again
    await persistVectorStore();
  }
}
