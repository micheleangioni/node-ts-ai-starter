import IUserRepo from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';
import ApplicationError from '../ApplicationError';
import { ErrorCodes, UserCreateData } from '../declarations';
import EventPublisher from '../eventPublisher';

export default class UserService {
  constructor(private userRepo: IUserRepo, private eventPublisher?: EventPublisher) {}

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
    const user = new User({ id: this.userRepo.nextIdentity(), ...data });

    return await this.persistUserAndEmitEvents(user, source);
  }

  private async persistUserAndEmitEvents(user: User, source: string): Promise<User> {
    const updatedUser = await this.userRepo.persist(user);
    await this.sendApplicationEvents(source, updatedUser);

    return updatedUser;
  }

  private async sendApplicationEvents(source: string, user: User): Promise<true> {
    if (!user.getCreatedAt()) {
      throw new ApplicationError({
        code: ErrorCodes.INTERNAL_ERROR,
        error: 'A non-persisted User should not be used to send events',
        status: 500,
      });
    }

    if (this.eventPublisher) {
      await this.eventPublisher.publish(source, user.releaseDomainEvents(), user.getId().toString());
    }

    return true;
  }
}
