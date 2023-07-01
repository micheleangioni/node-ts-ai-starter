import {OpenAI} from 'langchain/llms/openai';
import {BufferMemory} from 'langchain/memory';
import {PromptTemplate} from 'langchain/prompts';
import {LLMChain} from 'langchain/chains';
import config from '../../config';

const {defaultContext, defaultMaxTokens, defaultTemperature} = config.llm.chat;

export default ({context, maxTokens, temperature, verbose}: {
  context?: string;
  maxTokens?: number;
  temperature?: number;
  template?: string;
  verbose?: boolean;
}) => {
  const model = new OpenAI({
    maxTokens: maxTokens?? defaultMaxTokens,
    modelName: 'gpt-3.5-turbo',
    streaming: false,
    temperature: temperature ?? defaultTemperature,
  });

  // Instantiate the Chat Memory for storing state
  // LangChain seems not to expose a proper interface for this :/
  let memory: any;

  switch (process.env.CHAT_MEMORY_PERSISTENCE) {
    case 'memory':
    default:
      memory = new BufferMemory({ memoryKey: 'chat_history' });
  }

  // Create the template. The template is actually a "parameterized prompt".
  // A "parameterized prompt" is a prompt in which the input parameter names are used
  // and the parameter values are supplied from external input
  const chatContext = context ?? defaultContext;

  const template = chatContext +
    `Current conversation:
      {chat_history}
      Human: {input}
      AI:`;

  // Instantiate "PromptTemplate" passing the prompt template string initialized above
  const prompt = PromptTemplate.fromTemplate(template);

  // Instantiate LLMChain, which consists of a PromptTemplate, an LLM and memory.
  return new LLMChain({ llm: model, memory, prompt, verbose });
};
