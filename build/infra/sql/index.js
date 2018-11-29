"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const sequelize_1 = __importDefault(require("sequelize"));
exports.default = () => new sequelize_1.default(`${process.env.SQL_NAME}`, `${process.env.SQL_USERNAME}`, `${process.env.SQL_PASSWORD}`, {
    dialect: `${process.env.SQL_DIALECT}`,
    host: `${process.env.SQL_HOST}`,
    pool: {
        acquire: 30000,
        idle: 10000,
        max: 5,
        min: 0,
    },
    // SQLite only
    storage: path_1.default.join(__dirname, '../../../storage/db.sqlite'),
    logging: false,
});
//# sourceMappingURL=index.js.map