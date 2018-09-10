import { UserCreateData, UserUpdateData } from '../../domain/user/declarations';
import User from '../../domain/user/user';
export interface IUserRepo {
    all(): Promise<User[]>;
    findById(userId: string): Promise<User> | Promise<object>;
    findByEmail(email: string): Promise<User> | Promise<object>;
    count(): Promise<number>;
    create(data: UserCreateData): Promise<User>;
    updateUser(userId: string, data: UserUpdateData): Promise<User>;
}
