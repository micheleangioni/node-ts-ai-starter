import moment from 'moment';
import { UserData } from '../../domain/user/declarations';
import IUserRepo from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';
import { default as UserModel } from '../sql/models/users/user';

class SqlUserRepo implements IUserRepo {
  /**
   * Create and return a new MongoDB id.
   *
   * @return string
   */
  public nextIdentity(): string {
    throw new Error('SqlUserRepo uses auto-incremental ids');
  }

  /**
   * Return all Users as an array of User entities.
   *
   * @returns Promise<User[]>
   */
  public all(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      UserModel.findAll()
        .then((data: UserModel[]) => {
          return resolve(data.map((userData: UserModel) => new User(this.convertUserModelToUserData(userData))));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Find and return a User by id.
   * Resolve an empty object if no User is found.
   *
   * @param {string} userId
   * @returns Promise<User> | Promise<object>
   */
  public findById(userId: string): Promise<User|null> {
    return new Promise((resolve, reject) => {
      UserModel.findByPk(userId)
        .then((userData) => {
          if (!userData) {
            resolve(null);

            return;
          }

          resolve(new User(this.convertUserModelToUserData(userData)));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Find and return a User by email.
   * Resolve an empty object if no User is found.
   *
   * @param {string} email
   * @returns Promise<User> | Promise<object>
   */
  public findByEmail(email: string): Promise<User|null> {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ where: { email } })
        .then((userData) => {
          if (userData === null) {
            resolve(null);

            return;
          }

          resolve(new User(this.convertUserModelToUserData(userData)));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Find and return a User by username.
   * Resolve an empty object if no User is found.
   *
   * @param {string} username
   * @returns Promise<User> | Promise<object>
   */
  public findByUsername(username: string): Promise<User|null> {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ where: { username } })
        .then((userData) => {
          if (userData === null) {
            resolve(null);

            return;
          }

          resolve(new User(this.convertUserModelToUserData(userData)));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Count the number of Users.
   *
   * @return Promise<number>
   */
  public count(): Promise<number> {
    return new Promise((resolve, reject) => {
      UserModel.count({})
        .then((count: number) => resolve(count))
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Persist a User instance.
   *
   * @param {User} user
   * @returns Promise<User>
   */
  public persist(user: User): Promise<User> {
    const userData: UserData = {
      email: user.getEmail(),
      id: user.getId(),
      password: user.getPassword(),
    };

    if (user.getUsername()) {
      userData.username = user.getUsername();
    }

    return new Promise((resolve, reject) => {
      UserModel
        .findOne({ where: { id: user.getId() } })
        .then((foundUserData) => {
          if (!foundUserData) {
            // Item doesn't exist, so we create it

            UserModel.create(userData)
              .then((persistedUserData) => {
                user.updateDates(moment(persistedUserData.createdAt));

                resolve(new User(this.convertUserModelToUserData(persistedUserData)));
              })
              .catch((error: any) => reject(error));
          }

          // Item already exists, so we update it
          UserModel
            .update(userData, { returning: true, where: { id: user.getId() } })
            .then(([_, [persistedUserData]]) => {
              user.updateDates(moment(persistedUserData.updatedAt));
              resolve(user);
            })
            .catch((error: any) => reject(error));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private convertUserModelToUserData(userModel: UserModel): UserData {
    return {
      email: userModel.email,
      id: userModel.id,
      password: userModel.password,
      username: userModel.username || undefined,
    };
  }
}

export default (): SqlUserRepo => {
  return new SqlUserRepo();
};
