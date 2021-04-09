import moment from 'moment';
import { Model, mongo } from 'mongoose';
import IUserRepo from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';
import { PersistedUserMongoData, ToBePersistedUserMongoData } from './declarations';

class UserRepo implements IUserRepo {
  constructor(private readonly userModel: Model<any>) {}

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
      const userData = await this.userModel.findById(userId).lean() as PersistedUserMongoData | null;

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
      const userData = await this.userModel.findOne({ email }).lean() as PersistedUserMongoData | null;

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
      const userData = await this.userModel.findOne({ username }).lean() as PersistedUserMongoData | null;

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
    const userData: ToBePersistedUserMongoData = {
      _id: user.getId().toString(),
      email: user.getEmail(),
      password: user.getPassword(),
    };

    if (user.getUsername()) {
      userData.username = user.getUsername();
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      user.getId().toString(),
      userData,
      { new: true, upsert: true }).lean() as PersistedUserMongoData;

    user.updateDates(moment(updatedUser.createdAt));

    return user;
  }
}

export default (userModel: Model<any>): UserRepo => {
  return new UserRepo(userModel);
};
