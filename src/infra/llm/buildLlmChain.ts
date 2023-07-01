import {OpenAI} from 'langchain/llms/openai';
import {BufferMemory} from 'langchain/memory';
import {PromptTemplate} from 'langchain/prompts';
import {LLMChain} from 'langchain/chains';

export default ({context, maxTokens, temperature, verbose}: {
  context?: string;
  maxTokens?: number;
  temperature?: number;
  template?: string;
  verbose?: boolean;
}) => {
  const model = new OpenAI({
    maxTokens: maxTokens?? 100,
    modelName: 'gpt-3.5-turbo',
    streaming: false,
    temperature: temperature ?? 0.2,
  });

  // Instantiate the BufferMemory passing the memory key for storing state
  const memory = new BufferMemory({ memoryKey: 'chat_history' });

  // Create the template. The template is actually a "parameterized prompt".
  // A "parameterized prompt" is a prompt in which the input parameter names are used
  // and the parameter values are supplied from external input
  const chatContext = context ?? `
    The following is a friendly conversation between a human and an AI. 
    The AI is talkative and provides lots of specific details from its context. 
    If the AI does not know the answer to a question, it truthfully says it does not know. The AI simply.
    Every time you are prompted, simply complete the prompt with a single AI answer.
    `;

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
