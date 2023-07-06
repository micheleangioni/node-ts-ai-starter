import {ContextualCompressionRetriever} from 'langchain/retrievers/contextual_compression';
import {OpenAI} from 'langchain/llms/openai';
import {LLMChainExtractor} from 'langchain/retrievers/document_compressors/chain_extract';
import {QueryDocsOptions} from '../declarations';
import {QueryDocsQuery} from '../queries/queryDocsQuery';
import IHandler from '../../IHandler';
import {RetrievalQAChain} from 'langchain/chains';

export class QueryDocsQueryHandler implements IHandler {
  private readonly chain: RetrievalQAChain;

  constructor({maxTokens, temperature, vectorStore, verbose}: QueryDocsOptions) {
    const model = new OpenAI({
      maxTokens: maxTokens?? 100,
      modelName: 'gpt-3.5-turbo',
      streaming: false,
      temperature: temperature ?? 0.2,
    });

    // We want to implement Contextual Compression
    // See https://js.langchain.com/docs/modules/indexes/retrievers/contextual-compression-retriever

    // The LLMChainExtractor will iterate over the initially returned documents
    // and extract from each only the content that is relevant to the query.
    const baseCompressor = LLMChainExtractor.fromLLM(model);

    const retriever = new ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever: vectorStore.asRetriever(),
    });

    // We then create a Retrieval Q&A. The Retriever will be used to retrieve the docs relevant to the input query
    // everytime the LLM will get called
    this.chain = RetrievalQAChain.fromLLM(model, retriever, {verbose});
  }

  async handle({ query }: QueryDocsQuery): Promise<string> {
    const response = await this.chain.call({query});

    return response.text;
  }
}
