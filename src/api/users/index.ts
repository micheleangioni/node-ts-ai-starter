import {FastifyInstance} from 'fastify';
import {FromSchema} from 'json-schema-to-ts';
import userTransformer from './userTransformer';
import createIoCContainer from '../createIoCContainer';
import errorHandler from '../errorHandler';
import CreateUserCommand from '../../application/user/commands/createUserCommand';
import {CreateUserCommandHandler} from '../../application/user/handlers/createUserCommandHandler';
import UserService from '../../application/user/userService';
import User from '../../domain/user/user';

export default (app: FastifyInstance, source: string) => {
  const logger = app.log;
  const container = createIoCContainer();
  const userService = container.resolve(UserService);

  /**
   * Retrieve all Users.
   */
  app.get(source, async (_req, res) => {
    let users;

    try {
      users = await userService.getAll();
    } catch (err) {
      return errorHandler(err, res, logger);
    }

    res.send({
      data: users.map((user: User) => {
        return userTransformer(user);
      }),
    });
  });

  const postUserBody = {
    properties: {
      email: {
        format: 'email',
        maxLength: 128,
        minLength: 6,
        type: 'string',
      },
      password: {
        maxLength: 100,
        minLength: 12,
        type: 'string',
      },
      username: {
        maxLength: 25,
        minLength: 4,
        // eslint-disable-next-line
        pattern: '^[\\w]+', // \w is equivalent to [A-Za-z0-9_]
        type: 'string',
      },
    },
    required: ['email', 'password'],
    type: 'object',
  } as const;

  /**
   * Create a new User.
   */
  app.post<{ Body: FromSchema<typeof postUserBody> }>(
    source,
    {
      schema: {
        body: postUserBody,
      }},
    async (req, res) => {
      let user;
      const {email, password, username} = req.body;

      try {
        user = await new CreateUserCommandHandler(userService).handle(new CreateUserCommand({
          email,
          password,
          source,
          username,
        }));
      } catch (err) {
        return errorHandler(err, res, logger);
      }

      res.send({
        data: userTransformer(user),
      });
    });

  return app;
};
