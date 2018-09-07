import express from 'express';
import {UserCreateData, UserData, UserUpdateData} from '../../domain/user/declarations';
import User from '../../domain/user/user';

export default function (app: express.Application) {
  const userModel = app.get('userModel');

  return {

    /**
     * Return all Users as an array of User entities.
     *
     * @returns {Promise<User[]>}
     */
    all () {
      return new Promise((resolve, reject) => {
        userModel.find()
          .then((data: UserData[]) => resolve(data.map((userData: UserData) => new User(userData))))
          .catch((error: any) => reject(error));
      });
    },

    /**
     * Find and return a User by id.
     * Resolve an empty object if no User is found.
     *
     * @param {string} userId
     * @returns {Promise<User>}
     */
    findById (userId: string) {
      return new Promise((resolve, reject) => {
        userModel.findById(userId)
          .then((userData: UserData | null) => {
            if (!userData) {
              resolve({});

              return;
            }

            resolve(new User(userData));
          })
          .catch((error: any) => reject(error));
      });
    },

    /**
     * Find and return a User by email.
     * Resolve an empty object if no User is found.
     *
     * @param {string} email
     * @returns {Promise<any>}
     */
    findByEmail (email: string) {
      return new Promise((resolve, reject) => {
        userModel.findOne({ email })
          .then((userData: UserData | null) => {
            if (!userData) {
              resolve({});

              return;
            }

            resolve(new User(userData));
          })
          .catch((error: any) => reject(error));
      });
    },

    /**
     * Count the number of Users.
     *
     * @return {Promise<number>}
     */
    count () {
      return new Promise((resolve, reject) => {
        return userModel.count()
          .then((count: number) => resolve(count))
          .catch((error: any) => reject(error));
      });
    },

    /**
     * Create a new User.
     *
     * @param {UserCreateData} data
     * @returns {Promise<User>}
     */
    create (data: UserCreateData ) {
      return new Promise((resolve, reject) => {
        userModel.create(data)
          .then((userData: UserData) => {
            resolve(new User(userData));
          })
          .catch((error: any) => reject(error));
      });
    },

    /**
     * Update input User.
     *
     * @param {string} userId
     * @param {UserUpdateData} data
     * @returns {Promise<any>}
     */
    updateUser(userId: string, data: UserUpdateData) {
      return new Promise((resolve, reject) => {
        userModel.findByIdAndUpdate(userId, data)
          .then((userData: UserData) => {
            resolve(new User(userData));
          })
          .catch((error: any) => reject(error));
      });
    },
  };
}
