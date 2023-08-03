const env = process.env.NODE_ENV ?? 'development';

export default {
  kafka: {
    topics: {
      user: {
        numPartitions: ['staging', 'production'].includes(env) ? 16 : 1,
        replicationFactor: ['staging', 'production'].includes(env) ? 2 : 1,
        topic: 'myCompany.events.node-ts-ai-starter.user',
      },
    },
  },

  llm: {
    chat: {
      defaultContext: `
        The following is a friendly conversation between a human and an AI. 
        The AI is talkative and provides lots of specific details from its context. 
        If the AI does not know the answer to a question, it truthfully says it does not know. The AI simply.
        Every time you are prompted, simply complete the prompt with a single AI answer.
        `,
      defaultMaxTokens: 100,
      defaultTemperature: 0.2,
    },

    fileLoading: {
      chunkOverlap: 10,
      chunkSize: 100
    },

    vectorStore: {
      hnswlib: {
        folder: 'storage',
      },
    },
  },

  llm: {
    chat: {
      defaultContext: `
        The following is a friendly conversation between a human and an AI. 
        The AI is talkative and provides lots of specific details from its context. 
        If the AI does not know the answer to a question, it truthfully says it does not know. The AI simply.
        Every time you are prompted, simply complete the prompt with a single AI answer.
        `,
      defaultMaxTokens: 100,
      defaultTemperature: 0.2,
    },

    fileLoading: {
      chunkOverlap: 10,
      chunkSize: 100
    },

    vectorStore: {
      hnswlib: {
        folder: 'storage',
      },
    },
  },
};
