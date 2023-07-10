import express from 'express';
const router = express.Router();
import usersValidationNew from './middlewares/users.validation.new';
import userTransformer from './userTransformer';
import errorHandler from '../errorHandler';
import UserService from '../../application/user/userService';
import CreateUserCommand from '../../application/user/commands/createUserCommand';
import {CreateUserCommandHandler} from '../../application/user/handlers/createUserCommandHandler';
import IUserRepo from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';
import ILogger from '../../infra/logger/ILogger';
import ApplicationError from '../../application/ApplicationError';
import {ErrorCodes} from '../../application/declarations';

export default (app: express.Application, source: string) => {
  const logger = app.get('logger') as ILogger;
  const sqlUserRepo = app.get('sqlUserRepo') as IUserRepo;
  const userService = app.get('userService') as UserService;

  /**
   * Retrieve all Users.
   */
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/sql', async (_req, res) => {
    let users;

    try {
      users = await sqlUserRepo.all();
    } catch (err) {
      return errorHandler(err, res, logger);
    }

    res.json({
      data: users.map((user: User) => {
        return userTransformer(user);
      }),
    });
  });

  /**
   * Retrieve all Users.
   */
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/', async (_req, res) => {
    let users;

    try {
      users = await userService.getAll();
    } catch (err) {
      return errorHandler(err, res, logger);
    }

    res.json({
      data: users.map((user: User) => {
        return userTransformer(user);
      }),
    });
  });

  /**
   * Create a new User.
   */
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/', usersValidationNew, async (req, res) => {
    let user;

    const {email, password, username} = req.body;

    if (
      typeof email !== 'string'
      || typeof password !== 'string'
      || (username && typeof username !== 'string')
    ) {
      return errorHandler(new ApplicationError({
        code: ErrorCodes.INVALID_DATA,
        error: 'Invalid input parameters. `email` and `password` must be a string. Optional `username` as well',
        status: 412,
      }), res, logger);
    }

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

    res.json({
      data: userTransformer(user),
    });
  });

  return router;
};
