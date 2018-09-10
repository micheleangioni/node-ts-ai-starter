import express from 'express';

const router = express.Router();
import User from '../../domain/user/user';
import { IUserRepo } from '../../infra/repositories/declarations';
// import encryptPassword from './middlewares/encryptPassword';
// import usersValidationNew from './middlewares/users.validation.new';

export default function (app: express.Application) {
  const logger = app.get('logger');
  const userRepo = app.get('userRepo') as IUserRepo;

  // Validation Middleware.

  // router.post('/', usersValidationNew);

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
      data: users.map((userData: User) => {
        return {
          username: userData.getUsername(),
        };
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
      res.status(500).json({hasError: 1, error: 'Internal error'});

      return;
    }

    res.json({
      data: {
        email: user.getEmail(),
        username: user.getUsername(),
      },
    });
  });

  return router;
}
