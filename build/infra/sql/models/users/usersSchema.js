"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
function default_1(sequelize) {
    // The following tweak allows for seeding in testing directly using Sequelize to handle DB operations
    try {
        sequelize.define('User', {
            email: { type: sequelize_1.default.STRING, allowNull: false },
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: sequelize_1.default.INTEGER.UNSIGNED,
            },
            password: { type: sequelize_1.default.STRING, allowNull: false },
            username: { type: sequelize_1.default.STRING, allowNull: true, defaultValue: null },
        }, {
            indexes: [{
                    fields: ['email'],
                    unique: true,
                }],
        });
    }
    catch (error) {
        // sequelize.models.User
    }
    return sequelize.models.User;
}
exports.default = default_1;
//# sourceMappingURL=usersSchema.js.map