import dayjs from 'dayjs';
import { Model, mongo } from 'mongoose';
import IUserRepo from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';
import { PersistedUserMongoData, ToBePersistedUserMongoData } from './declarations';

class UserRepo implements IUserRepo {
  constructor(private readonly userModel: Model<PersistedUserMongoData>) {}

  /**
   * Create and return a new MongoDB id.
   *
   * @return string
   */
  public nextIdentity(): string {
    return new mongo.ObjectID().toString();
  }

  /**
   * Return all Users as an array of User entities.
   *
   * @return Promise<User[]>
   */
  public async all(): Promise<User[]> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return (await this.userModel.find().lean() as PersistedUserMongoData[])
      .map((userData: PersistedUserMongoData) => new User({
        ...userData,
        id: userData._id.toString(),
      }));
  }

  /**
   * Find and return a User by id.
   * Resolve null if no User is found.
   *
   * @param {string} userId
   * @return Promise<User|null>
   */
  public async findById(userId: string): Promise<User|null> {
    try {
      const userData = await this.userModel.findById(userId).lean();

      return userData && new User({
        ...userData,
        id: userData._id.toString(),
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }

      throw error;
    }
  }

  /**
   * Find and return a User by email.
   * Resolve null if no User is found.
   *
   * @param {string} email
   * @return Promise<User|null>
   */
  public async findByEmail(email: string): Promise<User|null> {
    try {
      const userData = await this.userModel.findOne({ email }).lean();

      return userData && new User({
        ...userData,
        id: userData._id.toString(),
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }

      throw error;
    }
  }

  /**
   * Find and return a User by username.
   * Resolve null if no User is found.
   *
   * @param {string} username
   * @return Promise<User|null>
   */
  public async findByUsername(username: string): Promise<User|null> {
    try {
      const userData = await this.userModel.findOne({ username }).lean();

      return userData && new User({
        ...userData,
        id: userData._id.toString(),
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }

      throw error;
    }
  }

  /**
   * Count the number of Users.
   *
   * @return Promise<number>
   */
  public async count(): Promise<number> {
    return this.userModel.count({});
  }

  /**
   * Persist a User instance.
   *
   * @param {User} user
   * @return Promise<User>
   */
  public async persist(user: User): Promise<User> {
    const userData = this.getDataToBePersisted(user);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      user.getId().toString(),
      userData,
      { new: true, upsert: true }).lean();

    user.updateDates(dayjs(updatedUser.updatedAt));

    return user;
  }

  private getDataToBePersisted(user: User): ToBePersistedUserMongoData {
    return {
      _id: user.getId().toString(),
      email: user.getEmail(),
      password: user.getPassword(),
      ...(user.getUsername() && { username: user.getUsername() }),
    };
  }
}

export default (userModel: Model<any>): UserRepo => {
  return new UserRepo(userModel);
};
