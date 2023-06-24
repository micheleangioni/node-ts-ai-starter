import {SaveableVectorStore} from 'langchain/dist/vectorstores/base';
import {Document} from 'langchain/document';
import {CharacterTextSplitter} from 'langchain/text_splitter';
import {LoadFileIntoVectorStoreCommand} from '../commands/loadFileIntoVectorStoreCommand';
import config from '../../../config';
import IHandler from '../../IHandler';

const {chunkOverlap, chunkSize} = config.llm.fileLoading;

export class LoadFileIntoVectorStoreCommandHandler implements IHandler {
  constructor(
    private readonly vectorStore: SaveableVectorStore,
    private readonly folder: string,
  ) {}

  async handle({ buffer, fileName, mimetype }: LoadFileIntoVectorStoreCommand): Promise<void> {
    // TODO Missing: check whether a previously added file is trying to be added

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
    await this.vectorStore.addDocuments(docs);

    // Persist is again
    await this.vectorStore.save(this.folder);
  }
}
