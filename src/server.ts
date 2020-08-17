import express from 'express';
import application from './app';

const expressApp: express.Application = express();
const port = process.env.PORT || 3010;

expressApp.on('ready', () => {
  // tslint:disable-next-line:no-console
  expressApp.listen(port, () => console.log(`Application start: listening on port ${port}!`));
});

application(expressApp)
  .then(({ app, logger }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    logger.info(`Going to start application on port ${port}!`);
    app.emit('ready');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
