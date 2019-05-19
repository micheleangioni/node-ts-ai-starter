import express from 'express';
import application from './app';

const expressApp: express.Application = express();
const port = process.env.PORT || 8081;

expressApp.on('ready', () => {
  // tslint:disable-next-line:no-console
  expressApp.listen(port, () => console.log(`Application start: listening on port ${port}!`));
});

application(expressApp)
  .then(({ app, logger }) => {
    logger.info(`Going to start application on port ${port}!`);
    app.emit('ready');
  });
