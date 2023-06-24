import express from 'express';
import supertest from 'supertest';
import appModule from '../../../src/app';
import EventPublisher from '../../../src/application/eventPublisher';
import {UserCreated} from '../../../src/domain/user/events/UserCreated';
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

describe('Test the users API', () => {
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

  test('(GET)/ should respond with the list of users', async () => {
    const {body, statusCode} = await supertest(app).get('/api/users');

    expect(statusCode).toBe(200);
    expect(body.data.length).toBe(2);
  });

  test('(POST)/ should create and return a new user', async () => {
    const userData = {
      email: 'users.spec@test.com',
      password: 'password',
      username: 'usersSpec',
    };

    const {body, statusCode} = await supertest(app).post('/api/users')
      .send(userData);

    expect(statusCode).toBe(200);
    expect(body.data).toMatchObject({
      email: userData.email,
      username: userData.username,
    });

    expect(mockPublish.mock.calls.length).toBe(1);
    expect(mockPublish.mock.calls[0][1][0]).toBeInstanceOf(UserCreated);
    expect(mockPublish.mock.calls[0][1][0].getEventData()).toMatchObject({
      email: userData.email,
      username: userData.username,
    });
  });

  test('(POST)/ should return 422 if parameters are wrong', async () => {
    const userData: object = {
      email: 'users.spec@test.com',
      password: 'password',
      username: 'invalid.character',
    };

    const {statusCode} = await supertest(app).post('/api/users')
      .send(userData);

    expect(statusCode).toBe(422);
  });

  test('(GET)/sql should respond with the list of users of the SQL db', async () => {
    const {body, statusCode} = await supertest(app).get('/api/users/sql');

    expect(statusCode).toBe(200);
    expect(body.data.length).toBe(2);
  });
});
