"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const expressApp = express_1.default();
const port = process.env.PORT || 8081;
expressApp.on('ready', () => {
    // tslint:disable-next-line:no-console
    expressApp.listen(port, () => console.log(`Application start: listening on port ${port}!`));
});
app_1.default(expressApp)
    .then(({ app, logger }) => {
    logger.info(`Going to start application on port ${port}!`);
    app.emit('ready');
});
//# sourceMappingURL=server.js.map