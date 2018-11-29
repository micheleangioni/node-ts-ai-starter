"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersSchema_1 = __importDefault(require("./usersSchema"));
function default_1(app) {
    const sequelize = app.get('sqlClient');
    return usersSchema_1.default(sequelize);
}
exports.default = default_1;
//# sourceMappingURL=users.js.map