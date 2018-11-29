"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersSchema_1 = __importDefault(require("./usersSchema"));
function default_1(app) {
    const mongoose = app.get('mongooseClient');
    const usersSchema = usersSchema_1.default(mongoose);
    let model;
    // The following tweak allows for seeding in testing directly using Mongoose to handle DB operations
    try {
        model = mongoose.model('users', usersSchema);
    }
    catch (error) {
        model = mongoose.model('users');
    }
    return model;
}
exports.default = default_1;
//# sourceMappingURL=users.js.map