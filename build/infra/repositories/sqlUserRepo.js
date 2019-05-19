"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../../domain/user/user"));
const user_2 = __importDefault(require("../sql/models/users/user"));
class UserRepo {
    /**
     * Return all Users as an array of User entities.
     *
     * @returns {Promise<User[]>}
     */
    all() {
        return new Promise((resolve, reject) => {
            user_2.default.findAll()
                .then((data) => resolve(data.map((userData) => new user_1.default(userData))))
                .catch((error) => reject(error));
        });
    }
    /**
     * Find and return a User by id.
     * Resolve an empty object if no User is found.
     *
     * @param {string} userId
     * @returns {Promise<User> | Promise<object>}
     */
    findById(userId) {
        return new Promise((resolve, reject) => {
            user_2.default.findByPk(userId)
                .then((userData) => {
                if (!userData) {
                    resolve(null);
                    return;
                }
                resolve(new user_1.default(userData));
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Find and return a User by email.
     * Resolve an empty object if no User is found.
     *
     * @param {string} email
     * @returns {Promise<User> | Promise<object>}
     */
    findByEmail(email) {
        return new Promise((resolve, reject) => {
            user_2.default.findOne({ where: { email } })
                .then((userData) => {
                if (userData === null) {
                    resolve(null);
                    return;
                }
                resolve(new user_1.default(userData));
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Find and return a User by username.
     * Resolve an empty object if no User is found.
     *
     * @param {string} username
     * @returns {Promise<User> | Promise<object>}
     */
    findByUsername(username) {
        return new Promise((resolve, reject) => {
            user_2.default.findOne({ where: { username } })
                .then((userData) => {
                if (userData === null) {
                    resolve(null);
                    return;
                }
                resolve(new user_1.default(userData));
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Count the number of Users.
     *
     * @return {Promise<number>}
     */
    count() {
        return new Promise((resolve, reject) => {
            user_2.default.count({})
                .then((count) => resolve(count))
                .catch((error) => reject(error));
        });
    }
    /**
     * Create a new User.
     *
     * @param {UserCreateData} data
     * @returns {Promise<User>}
     */
    create(data) {
        return new Promise((resolve, reject) => {
            user_2.default.create(data)
                .then((userData) => {
                resolve(new user_1.default(userData));
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Update input User.
     *
     * @param {string} userId
     * @param {UserUpdateData} data
     * @returns {Promise<User>}
     */
    updateUser(userId, data) {
        return new Promise((resolve, reject) => {
            user_2.default.update(data, { returning: true, where: { id: userId } })
                .then(([_, updatedUsers]) => {
                resolve(new user_1.default(updatedUsers[0]));
            })
                .catch((error) => reject(error));
        });
    }
}
function default_1() {
    return new UserRepo();
}
exports.default = default_1;
//# sourceMappingURL=sqlUserRepo.js.map