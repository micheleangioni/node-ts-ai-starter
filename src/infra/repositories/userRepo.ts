import moment from 'moment';
import { Model, mongo } from 'mongoose';
import { UserData } from '../../domain/user/declarations';
import IUserRepo from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';
import { PersistedUserMongoData, ToBePersistedUserMongoData } from './declarations';

class UserRepo implements IUserRepo {
  protected userModel: Model<any>;

  constructor(userModel: Model<any>) {
    this.userModel = userModel;
  }

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
   * @returns {Promise<User[]>}
   */
  public all(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.userModel.find()
        .lean()
        .then((data: UserData[]) => resolve(data.map((userData: UserData) => new User(userData))))
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Find and return a User by id.
   * Resolve null if no User is found.
   *
   * @param {string} userId
   * @returns {Promise<User|null>}
   */
  public findById(userId: string): Promise<User|null> {
    return new Promise((resolve, reject) => {
      this.userModel.findById(userId)
        .lean()
        .then((userData: UserData | null) => {
          if (!userData) {
            resolve(null);

            return;
          }

          resolve(new User(userData));
        })
        .catch((error: any) => {
          if (error.name === 'CastError') {
            return resolve(null);
          }

          reject(error);
        });
    });
  }

  /**
   * Find and return a User by email.
   * Resolve null if no User is found.
   *
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  public findByEmail(email: string): Promise<User|null> {
    return new Promise((resolve, reject) => {
      this.userModel.findOne({ email })
        .lean()
        .then((userData: UserData | null) => {
          if (userData === null) {
            resolve(null);

            return;
          }

          resolve(new User(userData));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Find and return a User by username.
   * Resolve null if no User is found.
   *
   * @param {string} username
   * @returns {Promise<User|null>}
   */
  public findByUsername(username: string): Promise<User|null> {
    return new Promise((resolve, reject) => {
      this.userModel.findOne({ username })
        .lean()
        .then((userData: UserData | null) => {
          if (userData === null) {
            resolve(null);

            return;
          }

          resolve(new User(userData));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Count the number of Users.
   *
   * @return {Promise<number>}
   */
  public count(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.userModel.count({})
        .then((count: number) => resolve(count))
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Persist a User instance.
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  public persist(user: User): Promise<User> {
    const userData: ToBePersistedUserMongoData = {
      _id: user.getId().toString(),
      email: user.getEmail(),
      password: user.getPassword(),
    };

    if (user.getUsername()) {
      userData.username = user.getUsername();
    }

    return new Promise((resolve, reject) => {
      this.userModel.findByIdAndUpdate(user.getId().toString(), userData, { new: true, upsert: true })
        .lean()
        .then((userPersistedData: PersistedUserMongoData) => {
          user.updateDates(moment(userPersistedData.createdAt));

          resolve(user);
        })
        .catch((error: any) => reject(error));
    });
  }
}

export default (userModel: Model<any>): UserRepo => {
  return new UserRepo(userModel);
};
