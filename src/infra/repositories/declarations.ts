import { UserCreateData, UserUpdateData } from '../../domain/user/declarations';
import User from '../../domain/user/user';

export interface IUserRepo {
  all (): Promise<User[]>;
  findById (userId: string): Promise<User|null>;
  findByEmail (email: string): Promise<User|null>;
  findByUsername (email: string): Promise<User|null>;
  count (): Promise<number>;
  create (data: UserCreateData ): Promise<User>;
  updateUser (userId: string, data: UserUpdateData): Promise<User>;
}
