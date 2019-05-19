"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersSchema_1 = __importDefault(require("./users/usersSchema"));
function default_1(app) {
    // Init models
    usersSchema_1.default(app.get('sqlClient'));
}
exports.default = default_1;
//# sourceMappingURL=models.js.map