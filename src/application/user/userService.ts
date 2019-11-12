import { mongo } from 'mongoose';
import { UserCreateData } from '../../domain/user/declarations';
import IUserRepo from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';
import ApplicationError from '../ApplicationError';
import { ErrorCodes } from '../declarations';

export default class UserService {
  constructor(private userRepo: IUserRepo) {}

  /**
   * Create and return a new MongoDB id.
   *
   * @return string
   */
  public nextIdentity(): string {
    return new mongo.ObjectID().toString();
  }

  public async getAll(): Promise<User[]> {
    return await this.userRepo.all();
  }

  public async getById(userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new ApplicationError({
        code: ErrorCodes.NOT_FOUND,
        message: 'User not found',
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
        message: 'User not found',
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
        message: 'User not found',
        status: 404,
      });
    }

    return user;
  }

  public async createUser(data: UserCreateData): Promise<User> {
    const user = new User({ id: this.nextIdentity(), ...data});

    return this.userRepo.persist(user);
  }
}
