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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const api_1 = __importDefault(require("./api"));
const application_1 = __importDefault(require("./application"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
// Define a very basic logger
const logger = console;
const infra_1 = __importDefault(require("./infra"));
function loadApp(app) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Attach the infrastructure services to the Application.
         */
        yield infra_1.default(app);
        /**
         * Attach the application services to the Application.
         */
        yield application_1.default(app);
        /**
         * Attach the api services to the Application.
         */
        yield api_1.default(app);
        return app;
    });
}
function default_1(app) {
    app.set('logger', logger);
    /**
     * Configure Body Parser.
     */
    app.use(body_parser_1.default.urlencoded({
        extended: true,
    }));
    app.use(body_parser_1.default.json());
    /**
     * Use CORS and enable pre-flight across all routes.
     */
    app.use(cors_1.default({
        allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
        exposedHeaders: ['Authorization', 'Content-Type'],
    }));
    app.options('*', cors_1.default({
        allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
        exposedHeaders: ['Authorization', 'Content-Type'],
    }));
    process.on('uncaughtException', (err) => {
        // tslint:disable-next-line:no-console
        console.log(`${new Date().toISOString()} uncaughtException`, err);
        logger.error(err.message);
        logger.error(err.stack);
        process.exit(1);
    });
    return loadApp(app)
        .then((expressApp) => {
        return { app: expressApp, logger };
    });
}
exports.default = default_1;
//# sourceMappingURL=app.js.map