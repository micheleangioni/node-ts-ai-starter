import EventPublisher from '../../../src/application/eventPublisher';
import UserService from '../../../src/application/user/userService';
import {UserCreated} from '../../../src/domain/user/events/UserCreated';
import {cleanDatabase, seedDatabase, userRepo} from '../../seeding';
import {UserCreateData} from '../../../src/application/declarations';

jest.mock('../../../src/application/eventPublisher');

describe('Test the User Application Service', () => {
  const mockPublish = jest.fn();
  // @ts-ignore
  const mockEventPublisherFactory = jest.fn<EventPublisher, []>().mockImplementation(() => {
    return {
      publish: mockPublish,
    };
  });

  const mockEventPublisher = new mockEventPublisherFactory();

  const userService = new UserService(userRepo, mockEventPublisher);

  beforeEach(async () => {
    await cleanDatabase();
    await seedDatabase();
  });

  afterEach(async () => {
    await cleanDatabase();
    jest.resetAllMocks();
  });

  describe('Test getAll()', () => {
    test('It correctly gets the Users', async () => {
      const users = await userService.getAll();

      expect(users.length).toBe(2);
    });
  });

  describe('Test createUser()', () => {
    test('It correctly creates a User', async () => {
      const userData: UserCreateData = {
        email: 'test10@test.com',
        password: 'password',
        username: 'Test10',
      };
      const user = await userService.createUser(userData, '/test');

      expect(user.getEmail()).toBe(userData.email);
      expect(user.getUsername()).toBe(userData.username);
      expect(user.getCreatedAt()).not.toBe(undefined);
      expect(user.getUpdatedAt()).not.toBe(undefined);
      expect(mockPublish).toHaveBeenCalledTimes(1);
      expect(mockPublish.mock.calls[0][1][0]).toBeInstanceOf(UserCreated);
      expect(mockPublish.mock.calls[0][1][0].getEventData()).toMatchObject({
        email: userData.email,
        username: userData.username,
      });
    });

    test('It gets a error if trying to add a User with already taken email', async () => {
      const userData: UserCreateData = {
        email: 'test@test.com',
        password: 'password10',
        username: 'Test10',
      };

      await expect(userService.createUser(userData, '/test')).rejects.toThrow();
      expect(mockPublish).toHaveBeenCalledTimes(0);
    });
  });
});
