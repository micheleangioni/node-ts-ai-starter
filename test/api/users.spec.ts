import express from 'express';
import supertest from 'supertest';
import appModule from '../../src/app';
import { cleanDatabase, seedDatabase } from '../seeding';

describe('Test the users API', () => {
  const expressApp: express.Application = express();

  beforeEach(async (done) => {
    await cleanDatabase();
    await seedDatabase();
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
    const userData: object = {
      email: 'users.spec@test.com',
      password: 'password',
      username: 'usersSpec',
    };

    supertest(app).post('/api/users')
      .send(userData)
      .then((response: any) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toMatchObject({
          email: 'users.spec@test.com',
          username: 'usersSpec',
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
});
