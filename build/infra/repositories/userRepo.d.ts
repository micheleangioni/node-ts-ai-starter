import { Model } from 'mongoose';
import { UserCreateData, UserUpdateData } from '../../domain/user/declarations';
import User from '../../domain/user/user';
import { IUserRepo } from './declarations';
declare class UserRepo implements IUserRepo {
    protected userModel: Model<any>;
    constructor(userModel: Model<any>);
    /**
     * Return all Users as an array of User entities.
     *
     * @returns {Promise<User[]>}
     */
    all(): Promise<User[]>;
    /**
     * Find and return a User by id.
     * Resolve an empty object if no User is found.
     *
     * @param {string} userId
     * @returns {Promise<User> | Promise<object>}
     */
    findById(userId: string): Promise<User> | Promise<object>;
    /**
     * Find and return a User by email.
     * Resolve an empty object if no User is found.
     *
     * @param {string} email
     * @returns {Promise<User> | Promise<object>}
     */
    findByEmail(email: string): Promise<User> | Promise<object>;
    /**
     * Count the number of Users.
     *
     * @return {Promise<number>}
     */
    count(): Promise<number>;
    /**
     * Create a new User.
     *
     * @param {UserCreateData} data
     * @returns {Promise<User>}
     */
    create(data: UserCreateData): Promise<User>;
    /**
     * Update input User.
     *
     * @param {string} userId
     * @param {UserUpdateData} data
     * @returns {Promise<User>}
     */
    updateUser(userId: string, data: UserUpdateData): Promise<User>;
}
export default function (userModel: Model<any>): UserRepo;
export {};
