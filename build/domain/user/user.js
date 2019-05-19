"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
class User {
    constructor({ id, email, password, username }) {
        this.username = null;
        this.id = id;
        this.email = email;
        this.password = password;
        if (username) {
            this.username = username;
        }
    }
    getId() {
        return this.id;
    }
    getEmail() {
        return this.email;
    }
    setEmail(email) {
        if (!validator_1.default.isEmail(email)) {
            throw new Error('Invalid input email');
        }
        this.email = email;
    }
    getPassword() {
        return this.password;
    }
    setPassword(password) {
        this.password = password;
    }
    getUsername() {
        return this.username;
    }
    setUsername(username) {
        this.username = username;
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map