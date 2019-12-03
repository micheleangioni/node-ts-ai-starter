import express from 'express';
import supertest from 'supertest';
import appModule from '../../src/app';
import EventPublisher from '../../src/application/eventPublisher';
import {UserCreated} from '../../src/domain/user/events/UserCreated';
import { cleanDatabase, seedDatabase } from '../seeding';

jest.mock('../../src/application/eventPublisher');

describe('Test the users API', () => {
  const expressApp: express.Application = express();
  const mockPublish = jest.fn();

  beforeAll(() => {
    // @ts-ignore
    EventPublisher.mockImplementation(() => {
      return {
        publish: mockPublish,
      };
    });
  });

  beforeEach(async (done) => {
    await cleanDatabase();
    await seedDatabase();
    mockPublish.mockClear();
    done();
  });
  afterEach(async (done) => {
    await cleanDatabase();
    done();
  });

  test('(GET)/ should respond with the list of users', async (done) => {
    const { app } = await appModule(expressApp);

    supertest(app).get('/api/users').then((response: any) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(2);
      done();
    });
  });

  test('(POST)/ should create and return a new user', async (done) => {
    const { app } = await appModule(expressApp);
    const userData = {
      email: 'users.spec@test.com',
      password: 'password',
      username: 'usersSpec',
    };

    supertest(app).post('/api/users')
      .send(userData)
      .then((response: any) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toMatchObject({
          email: userData.email,
          username: userData.username,
        });
        expect(mockPublish.mock.calls[0][1][0]).toBeInstanceOf(UserCreated);
        expect(mockPublish.mock.calls[0][1][0].getEventData()).toMatchObject({
          email: userData.email,
          username: userData.username,
        });
        done();
      });
  });

  test('(POST)/ should return 422 if parameters are wrong', async (done) => {
    const { app } = await appModule(expressApp);
    const userData: object = {
      email: 'users.spec@test.com',
      password: 'password',
      username: 'invalid.character',
    };

    supertest(app).post('/api/users')
      .send(userData)
      .then((response: any) => {
        expect(response.statusCode).toBe(422);
        done();
      });
  });

  test('(GET)/sql should respond with the list of users of the SQL db', async (done) => {
    const { app } = await appModule(expressApp);

    supertest(app).get('/api/users/sql').then((response: any) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(2);
      done();
    });
  });
});
