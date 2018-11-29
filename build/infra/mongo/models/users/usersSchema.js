"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(mongooseClient) {
    const { Schema } = mongooseClient;
    return new Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        username: { type: String, unique: true, sparse: true },
    }, { timestamps: true });
}
exports.default = default_1;
//# sourceMappingURL=usersSchema.js.map