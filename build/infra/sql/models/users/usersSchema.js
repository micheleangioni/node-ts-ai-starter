"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("./User"));
exports.attributes = {
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
    },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    username: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null },
};
exports.tableName = 'users';
function default_1(sequelize) {
    User_1.default.init(exports.attributes, {
        sequelize,
        tableName: exports.tableName,
    });
    return true;
}
exports.default = default_1;
//# sourceMappingURL=usersSchema.js.map