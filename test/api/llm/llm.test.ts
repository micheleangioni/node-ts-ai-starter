import express from 'express';
import {MemoryVectorStore} from 'langchain/vectorstores/memory';
import supertest from 'supertest';
import appModule from '../../../src/app';
import EventPublisher from '../../../src/application/eventPublisher';
import {cleanDatabase, seedDatabase} from '../../seeding';
import {loadVectorStore} from '../../../src/infra/llm/vectorStore';
import retrievalQAChain from '../../../src/infra/llm/buildRetrievalQAChain';
import {RetrievalQAChain} from 'langchain/chains';

process.env.VECTOR_STORE = 'memory';

jest.mock('../../../src/application/eventPublisher');
jest.mock('../../../src/infra/llm/buildRetrievalQAChain');
jest.mock('../../../src/infra/llm/vectorStore');

const mockPublish = jest.fn();
const mockLoadVectorStore = jest.mocked(loadVectorStore);
const mockRetrievalQAChain = jest.mocked(retrievalQAChain);

// @ts-ignore
EventPublisher.mockImplementation(() => {
  return {
    publish: mockPublish,
  };
});

process.env.ENABLE_MESSAGE_BROKER = 'true';

describe('Test the llm API', () => {
  const expressApp: express.Application = express();
  let app: express.Application;

  beforeAll(async () => {
    app = (await appModule(expressApp)).app;
  });

  beforeEach(async () => {
    await cleanDatabase();
    await seedDatabase();
  });

  afterEach(async () => {
    await cleanDatabase();
    jest.resetAllMocks();
  });

  test('(GET) /search/documents should search the Vector Store', async () => {
    const mockedLLMResponseText = 'Mocked LLM answer';

    mockRetrievalQAChain.mockImplementation(() => {
      return {
        call: () => Promise.resolve({text: mockedLLMResponseText})
      } as unknown as Promise<RetrievalQAChain>
    });

    const {body, statusCode} = await supertest(app)
      .get('/api/llm/search/documents')
      .query({
        query: mockedLLMResponseText,
      });

    expect(statusCode).toBe(200);
    expect(body).toMatchObject({
      data: 'Mocked LLM answer',
    });
  });

  test('(POST) /search/load-document should load a document into the Vector Store', async () => {
    mockLoadVectorStore.mockImplementation(() => Promise.resolve() as unknown as Promise<MemoryVectorStore>);

    const filePath = `${__dirname}/../../testData/shortText.txt`;

    const {body, statusCode} = await supertest(app)
      .post('/api/llm/search/load-document')
      .attach('file', filePath, {
        contentType: 'text/plain',
      });

    expect(statusCode).toBe(200);
    expect(mockLoadVectorStore).toBeCalledTimes(1);
    expect(body).toMatchObject({
      data: 'File successfully loaded into the Vector Store',
    });
  });
});
