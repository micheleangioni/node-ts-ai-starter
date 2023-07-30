import {AbstractApplicationService} from '../AbstractApplicationService';
import ApplicationError from '../ApplicationError';
import { ErrorCodes, UserCreateData } from '../declarations';
import EventPublisher from '../eventPublisher';
import IUserRepo from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';

export default class UserService extends AbstractApplicationService {
  constructor(private readonly userRepo: IUserRepo, eventPublisher?: EventPublisher) {
    super(eventPublisher);
  }

  public async getAll(): Promise<User[]> {
    return await this.userRepo.all();
  }

  public async getById(userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new ApplicationError({
        code: ErrorCodes.NOT_FOUND,
        error: 'User not found',
        status: 404,
      });
    }

    return user;
  }

  public async getByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new ApplicationError({
        code: ErrorCodes.NOT_FOUND,
        error: 'User not found',
        status: 404,
      });
    }

    return user;
  }

  public async getByUsername(username: string): Promise<User> {
    const user = await this.userRepo.findByUsername(username);

    if (!user) {
      throw new ApplicationError({
        code: ErrorCodes.NOT_FOUND,
        error: 'User not found',
        status: 404,
      });
    }

    return user;
  }

  public async createUser(data: UserCreateData, source: string): Promise<User> {
    // Check whether the email has already been taken

    try {
      await this.getByEmail(data.email);

      throw new ApplicationError({
        code: ErrorCodes.FORBIDDEN,
        error: 'The email has already been taken.',
        status: 403,
      });
    } catch (error) {
      if (error.status !== 404) {
        throw error;
      }
    }

    // Check whether the username has already been taken

    if (data.username) {
      try {
        await this.getByUsername(data.username);

        throw new ApplicationError({
          code: ErrorCodes.FORBIDDEN,
          error: 'The username has already been taken.',
          status: 403,
        });
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }
      }
    }

    const user = new User({ id: this.userRepo.nextIdentity(), ...data });

    return await this.persistUserAndEmitEvents(user, source);
  }

  private async persistUserAndEmitEvents(user: User, source: string): Promise<User> {
    const updatedUser = await this.userRepo.persist(user);
    await this.sendApplicationEvents(source, updatedUser);

    return updatedUser;
  }
}
