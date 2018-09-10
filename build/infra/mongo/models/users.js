"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(app) {
    const mongoose = app.get('mongooseClient');
    const { Schema } = mongoose;
    const users = new Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        username: { type: String, unique: true },
    });
    return mongoose.model('users', users);
}
exports.default = default_1;
//# sourceMappingURL=users.js.map