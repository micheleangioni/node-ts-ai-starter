import { UserCreateData, UserData, UserUpdateData } from '../../domain/user/declarations';
import User from '../../domain/user/user';
import { default as UserModel } from '../sql/models/users/user';
import { IUserRepo } from './declarations';

class UserRepo implements IUserRepo {
  /**
   * Return all Users as an array of User entities.
   *
   * @returns {Promise<User[]>}
   */
  public all (): Promise<User[]> {
    return new Promise((resolve, reject) => {
      UserModel.findAll()
        .then((data: UserModel[]) => resolve(data.map((userData: UserModel) => new User(userData))))
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
  public findById (userId: string): Promise<User|null> {
    return new Promise((resolve, reject) => {
      UserModel.findByPk(userId)
        .then((userData: UserData | null) => {
          if (!userData) {
            resolve(null);

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
  public findByEmail (email: string): Promise<User|null> {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ where: { email } })
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
   * Resolve an empty object if no User is found.
   *
   * @param {string} username
   * @returns {Promise<User> | Promise<object>}
   */
  public findByUsername (username: string): Promise<User|null> {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ where: { username } })
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
  public count (): Promise<number> {
    return new Promise((resolve, reject) => {
      UserModel.count({})
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
      UserModel.create(data)
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
      UserModel.update(
        data,
        { returning: true, where: { id: userId } },
      )
        .then(([_, updatedUsers]) => {
          resolve(new User(updatedUsers[0]));
        })
        .catch((error: any) => reject(error));
    });
  }
}

export default function (): UserRepo {
  return new UserRepo();
}
