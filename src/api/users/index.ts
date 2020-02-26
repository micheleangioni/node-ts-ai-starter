import express from 'express';
const router = express.Router();
import UserService from '../../application/user/userService';
import IUserRepo from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';
import ILogger from '../../infra/logger/ILogger';
import errorHandler from '../errorHandler';
import usersValidationNew from './middlewares/users.validation.new';
import userTransformer from './userTransformer';

export default (app: express.Application, source: string) => {
  const logger = app.get('logger') as ILogger;
  const sqlUserRepo = app.get('sqlUserRepo') as IUserRepo;
  const userService = app.get('userService') as UserService;

  // Validation Middleware.

  router.post('/', usersValidationNew);

  // TODO Implement an encryption middleware. Suggested package for encryption: 'bcrypt'
  // Encrypt Password Middleware.

  // router.post('/', encryptPassword);

  /**
   * Retrieve all Users.
   */
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
  router.post('/', async (req, res) => {
    let user;

    try {
      user = await userService.createUser({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
      }, source);
    } catch (err) {
      return errorHandler(err, res, logger);
    }

    res.json({
      data: userTransformer(user),
    });
  });

  /**
   * Retrieve all Users.
   */
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

  return router;
};
