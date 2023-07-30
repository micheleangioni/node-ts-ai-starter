import Fastify, {FastifyInstance} from 'fastify';
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
  const fastifyApp = Fastify({
    logger: true,
  });
  let app: FastifyInstance;

  beforeAll(async () => {
    app = (await appModule(fastifyApp)).app;
    await app.ready();
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
    const {body} = await supertest(fastifyApp.server)
      .get('/api/users')
      .expect(200);

    expect(body.data.length).toBe(2);
  });

  test('(POST)/ should create and return a new user', async () => {
    const userData = {
      email: 'users.spec@test.com',
      password: 'passwordOfAtLeast12Chars',
      username: 'User_Spec',
    };

    const {body} = await supertest(app.server)
      .post('/api/users')
      .send(userData)
      .expect(200);

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
    const userDataInvalidUsername: object = {
      email: 'users.spec@test.com',
      password: 'password',
      username: 'invalid.character',
    };

    const userDataShortPassword: object = {
      email: 'users.spec@test.com',
      password: 'short',
      username: 'validUsername10',
    };

    const missingEmail: object = {
      password: 'password',
      username: 'validUsername10',
    };

    await supertest(app.server).post('/api/users')
      .send(userDataInvalidUsername)
      .expect(400);

    await supertest(app.server).post('/api/users')
      .send(userDataShortPassword)
      .expect(400);

    await supertest(app.server).post('/api/users')
      .send(missingEmail)
      .expect(400);
  });
});
