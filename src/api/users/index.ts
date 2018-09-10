import express from 'express';
const router = express.Router();
import User from '../../domain/user/user';
import { IUserRepo } from '../../infra/repositories/declarations';
import usersValidationNew from './middlewares/users.validation.new';
import userTransformer from './userTransformer';

export default function (app: express.Application) {
  const logger = app.get('logger');
  const userRepo = app.get('userRepo') as IUserRepo;

  // Validation Middleware.

  router.post('/', usersValidationNew);

  // TODO Implement an encryption middleware. Suggested package for encryption: 'bcrypt'
  // Encrypt Password Middleware.

  // router.post('/', encryptPassword);

  /**
   * Retrieve all Users.
   */
  router.get('/', async (req, res) => {
    let users;

    try {
      users = await userRepo.all();
    } catch (err) {
      logger.error(err);
      res.status(500).json({ hasError: 1, error: 'Internal error' });

      return;
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
      user = await userRepo.create({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
      });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ hasError: 1, error: 'Internal error' });

      return;
    }

    res.json({
      data: userTransformer(user),
    });
  });

  return router;
}
