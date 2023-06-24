const env = process.env.NODE_ENV ?? 'development';

export default {
  kafka: {
    topics: {
      user: {
        numPartitions: ['staging', 'production'].includes(env) ? 16 : 1,
        replicationFactor: ['staging', 'production'].includes(env) ? 2 : 1,
        topic: 'myCompany.events.node-ts-starter.user',
      },
    },
  },

  llm: {
    fileLoading: {
      chunkOverlap: 50,
      chunkSize: 1000
    },

    vectorStore: {
      hnswlib: {
        folder: 'storage',
      },
    },
  },
};
