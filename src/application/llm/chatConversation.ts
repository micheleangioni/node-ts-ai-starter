import { LLMChain } from 'langchain/chains';
import { SendMessageInput, ChatOptions } from './declarations';
import buildLlmChain from '../../infra/llm/buildLlmChain';

export default class ChatConversation {
  private readonly chain: LLMChain;

  constructor({context, maxTokens, temperature}: ChatOptions = {}) {
    this.chain = buildLlmChain({context, maxTokens, temperature});
  }
  public async sendMessage({message}: SendMessageInput): Promise<string> {
    const response = await this.chain.call({ input: message });

    return response.text;
  }
}
