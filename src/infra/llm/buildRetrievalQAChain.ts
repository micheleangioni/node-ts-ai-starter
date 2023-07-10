import {OpenAI} from 'langchain/llms/openai';
import {LLMChainExtractor} from 'langchain/retrievers/document_compressors/chain_extract';
import {ContextualCompressionRetriever} from 'langchain/retrievers/contextual_compression';
import {RetrievalQAChain} from 'langchain/chains';
import {loadVectorStore} from './vectorStore';
import isDebugModeActive from '../isDebugModeActive';

export default async ({maxTokens, temperature}: {
  maxTokens?: number;
  temperature?: number;
}): Promise<RetrievalQAChain> => {
  const vectorStore = await loadVectorStore();

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
  // In case adding Memory to the conversation is needed,
  // see https://js.langchain.com/docs/modules/chains/index_related_chains/conversational_retrieval
  return RetrievalQAChain.fromLLM(model, retriever, {
    returnSourceDocuments: false,
    verbose: isDebugModeActive(),
  });
};
