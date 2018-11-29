"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function transform(user) {
    return {
        email: user.getEmail(),
        username: user.getUsername(),
    };
}
exports.default = transform;
//# sourceMappingURL=userTransformer.js.map