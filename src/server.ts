import express from 'express';
import application from './app';

const app = express();
const port = process.env.PORT || 8081;

app.on('ready', function() {
    app.listen(port, () => console.log(`Application start: listening on port ${port}!`));
});

application(app)
    .then(({ app, logger }) => {
        logger.info(`Going to start application on port ${port}!`);
        app.emit('ready');
    });
