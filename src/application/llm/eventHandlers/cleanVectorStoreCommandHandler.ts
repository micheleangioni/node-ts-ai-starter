import IHandler from '../../IHandler';
import {cleanVectorStore} from '../../../infra/llm/vectorStore';

export class CleanVectorStoreCommandHandler implements IHandler {
  async handle(): Promise<boolean> {
    await cleanVectorStore();

    return true;
  }
}
