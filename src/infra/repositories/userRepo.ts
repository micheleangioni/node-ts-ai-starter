import { Model } from 'mongoose';
import { UserCreateData, UserData, UserUpdateData } from '../../domain/user/declarations';
import User from '../../domain/user/user';
import { IUserRepo } from './declarations';

class UserRepo implements IUserRepo {
  protected userModel: Model<any>;

  constructor(userModel: Model<any>) {
    this.userModel = userModel;
  }

  /**
   * Return all Users as an array of User entities.
   *
   * @returns {Promise<User[]>}
   */
  public all (): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.userModel.find()
        .then((data: UserData[]) => resolve(data.map((userData: UserData) => new User(userData))))
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Find and return a User by id.
   * Resolve an empty object if no User is found.
   *
   * @param {string} userId
   * @returns {Promise<User> | Promise<object>}
   */
  public findById (userId: string): Promise<User> | Promise<object> {
    return new Promise((resolve, reject) => {
      this.userModel.findById(userId)
        .then((userData: UserData | null) => {
          if (!userData) {
            resolve({});

            return;
          }

          resolve(new User(userData));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Find and return a User by email.
   * Resolve an empty object if no User is found.
   *
   * @param {string} email
   * @returns {Promise<User> | Promise<object>}
   */
  public findByEmail (email: string): Promise<User> | Promise<object> {
    return new Promise((resolve, reject) => {
      this.userModel.findOne({ email })
        .then((userData: UserData | null) => {
          if (userData === null) {
            resolve({});

            return;
          }

          resolve(new User(userData));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Find and return a User by username.
   * Resolve an empty object if no User is found.
   *
   * @param {string} username
   * @returns {Promise<User> | Promise<object>}
   */
  public findByUsername (username: string): Promise<User> | Promise<object> {
    return new Promise((resolve, reject) => {
      this.userModel.findOne({ username })
        .then((userData: UserData | null) => {
          if (userData === null) {
            resolve({});

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
  public count (): Promise<number> {
    return new Promise((resolve, reject) => {
      this.userModel.count({})
        .then((count: number) => resolve(count))
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Create a new User.
   *
   * @param {UserCreateData} data
   * @returns {Promise<User>}
   */
  public create (data: UserCreateData ): Promise<User> {
    return new Promise((resolve, reject) => {
      this.userModel.create(data)
        .then((userData: UserData) => {
          resolve(new User(userData));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Update input User.
   *
   * @param {string} userId
   * @param {UserUpdateData} data
   * @returns {Promise<User>}
   */
  public updateUser(userId: string, data: UserUpdateData): Promise<User> {
    return new Promise((resolve, reject) => {
      this.userModel.findByIdAndUpdate(userId, data)
        .then((userData: UserData) => {
          resolve(new User(userData));
        })
        .catch((error: any) => reject(error));
    });
  }
}

export default function (userModel: Model<any>): UserRepo {
  return new UserRepo(userModel);
}
