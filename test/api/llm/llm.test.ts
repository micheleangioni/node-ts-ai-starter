import express from 'express';
// import supertest from 'supertest';
import appModule from '../../../src/app';
import EventPublisher from '../../../src/application/eventPublisher';
import {cleanDatabase, seedDatabase} from '../../seeding';

jest.mock('../../../src/application/eventPublisher');

const mockPublish = jest.fn();

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

  // This tests fails because JEST causes a Segmentation Fault when the Vector Store tries to save the db to file
  // test('(POST)/ should create and return a new user', async () => {
  //   const filePath = `${__dirname}/../../testData/shortText.txt`;
  //
  //   const {body, statusCode} = await supertest(app)
  //     .post('/api/llm/search/load-document')
  //     .attach('file', filePath, {
  //       contentType: 'text/plain',
  //     });
  //
  //   expect(statusCode).toBe(200);
  //   expect(body.data).toMatchObject({
  //     data: 'File successfully loaded into the Vector Store',
  //   });
  // });
});
