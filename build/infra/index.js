"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("./mongo"));
const models_1 = __importDefault(require("./mongo/models/models"));
const sqlUserRepo_1 = __importDefault(require("./repositories/sqlUserRepo"));
const userRepo_1 = __importDefault(require("./repositories/userRepo"));
const sql_1 = __importDefault(require("./sql"));
const models_2 = __importDefault(require("./sql/models/models"));
function default_1(app) {
    // If MongoDB is active, add Mongoose and its models
    if (process.env.DB_ACTIVE === 'true') {
        app.set('mongooseClient', mongo_1.default);
        models_1.default(app);
        // Add repositories
        app.set('userRepo', userRepo_1.default(app.get('userModel')));
    }
    // If a SQL dialect is set, add Sequelize, its models and repos
    if (process.env.SQL_DIALECT !== 'none') {
        app.set('sqlClient', sql_1.default());
        models_2.default(app);
        app.set('sqlUserRepo', sqlUserRepo_1.default());
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map