"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const users_validation_new_1 = __importDefault(require("./middlewares/users.validation.new"));
const userTransformer_1 = __importDefault(require("./userTransformer"));
function default_1(app) {
    const logger = app.get('logger');
    const sqlUserRepo = app.get('sqlUserRepo');
    const userRepo = app.get('userRepo');
    // Validation Middleware.
    router.post('/', users_validation_new_1.default);
    // TODO Implement an encryption middleware. Suggested package for encryption: 'bcrypt'
    // Encrypt Password Middleware.
    // router.post('/', encryptPassword);
    /**
     * Retrieve all Users.
     */
    router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
        let users;
        try {
            users = yield userRepo.all();
        }
        catch (err) {
            logger.error(err);
            res.status(500).json({ hasError: 1, error: 'Internal error' });
            return;
        }
        res.json({
            data: users.map((user) => {
                return userTransformer_1.default(user);
            }),
        });
    }));
    /**
     * Create a new User.
     */
    router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
        let user;
        try {
            user = yield userRepo.create({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
            });
        }
        catch (err) {
            logger.error(err);
            res.status(500).json({ hasError: 1, error: 'Internal error' });
            return;
        }
        res.json({
            data: userTransformer_1.default(user),
        });
    }));
    /**
     * Retrieve all Users.
     */
    router.get('/sql', (req, res) => __awaiter(this, void 0, void 0, function* () {
        let users;
        try {
            users = yield sqlUserRepo.all();
        }
        catch (err) {
            logger.error(err);
            res.status(500).json({ hasError: 1, error: 'Internal error' });
            return;
        }
        res.json({
            data: users.map((user) => {
                return userTransformer_1.default(user);
            }),
        });
    }));
    return router;
}
exports.default = default_1;
//# sourceMappingURL=index.js.map