import {QueryDocsOptions} from '../declarations';
import {QueryDocsQuery} from '../queries/queryDocsQuery';
import IHandler from '../../IHandler';
import {RetrievalQAChain} from 'langchain/chains';
import buildRetrievalQAChain from '../../../infra/llm/buildRetrievalQAChain';

export class QueryDocsQueryHandler implements IHandler {
  private readonly maxTokens?: number;
  private readonly temperature?: number;
  private chain: RetrievalQAChain;

  constructor({maxTokens, temperature}: QueryDocsOptions) {
    this.maxTokens = maxTokens;
    this.temperature = temperature;
  }

  async handle({ query }: QueryDocsQuery): Promise<string> {
    if (!this.chain) {
      this.chain = await buildRetrievalQAChain({
        maxTokens: this.maxTokens,
        temperature: this.temperature,
      });
    }

    const response = await this.chain.call({
      query: `
        Use ONLY the provided context above to answer this message: ${query}.
        If the information is not provided in the context, just answer 'I don't know'
      `,
    });

    return response.text;
  }
}
