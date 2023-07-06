import {QueryDocsOptions} from '../declarations';
import {QueryDocsQuery} from '../queries/queryDocsQuery';
import IHandler from '../../IHandler';
import {RetrievalQAChain} from 'langchain/chains';
import buildRetrievalQAChain from '../../../infra/llm/buildRetrievalQAChain';

export class QueryDocsQueryHandler implements IHandler {
  private readonly maxTokens?: number;
  private readonly temperature?: number;
  private readonly verbose?: boolean;
  private chain: RetrievalQAChain;

  constructor({maxTokens, temperature, verbose}: QueryDocsOptions) {
    this.maxTokens = maxTokens;
    this.temperature = temperature;
    this.verbose = verbose;
  }

  async handle({ query }: QueryDocsQuery): Promise<string> {
    if (!this.chain) {
      this.chain = await buildRetrievalQAChain({
        maxTokens: this.maxTokens,
        temperature: this.temperature,
        verbose: this.verbose,
      });
    }

    const response = await this.chain.call({query});

    return response.text;
  }
}
