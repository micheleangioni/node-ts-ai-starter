import Fastify from 'fastify';
import application from './app';

const fastifyApp = Fastify({
  logger: true,
});
const port = Number(process.env.PORT) || 3010;

application(fastifyApp)
  .then(({ app }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    app.log.info(`Going to start application on port ${port}!`);

    app.listen({ port }, (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }

      console.log(`Application start: listening on address ${address}!`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
