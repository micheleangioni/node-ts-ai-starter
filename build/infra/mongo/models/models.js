"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("./users"));
function default_1(app) {
    app.set('userModel', users_1.default(app));
}
exports.default = default_1;
//# sourceMappingURL=models.js.map