"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("./mongo"));
const models_1 = __importDefault(require("./mongo/models/models"));
const userRepo_1 = __importDefault(require("./repositories/userRepo"));
function default_1(app) {
    // Add Mongoose and its models
    app.set('mongooseClient', mongo_1.default);
    models_1.default(app);
    // Add repositories
    app.set('userRepo', userRepo_1.default(app.get('userModel')));
}
exports.default = default_1;
//# sourceMappingURL=index.js.map