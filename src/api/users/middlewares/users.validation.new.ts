import {NextFunction, Request, Response} from 'express';
import validator from 'validator';
import User from '../../../domain/user/user';
import { IUserRepo } from '../../../infra/repositories/declarations';

export default async function (req: Request, res: Response, next: NextFunction) {
  const logger = req.app.get('logger');
  const userRepo = req.app.get('userRepo') as IUserRepo;

  const data = req.body;
  const errors = [];

  // Check whether there is the `email` property
  if (!data.email) {
    errors.push('The email is missing.');
  } else {
    data.email = data.email.trim();

    if (!validator.isEmail(data.email)) {
      errors.push('The email is invalid.');
    } else {
      // Check whether the username has already been taken
      let user;

      try {
        user = await userRepo.findByEmail(data.email);
      } catch (e) {
        logger.error(e);
        res.status(500).json({ hasError: 1, error: 'Internal error.' });

        return;
      }

      if (user instanceof User) {
        errors.push('The email has already been taken.');
      }
    }
  }

  // Check whether there is the `username` property
  if (data.username) {
    data.username = data.username.trim();

    // Check whether it is a string and a valid username
    if (typeof data.username !== 'string') {
      errors.push('The username is invalid.');
    } else if (data.username.length < 4 || data.username.length > 25) {
      errors.push('The username must be at least 4 and not more than 25 characters long.');
    } else if (!validator.isAlphanumeric(data.username)) {
      errors.push('Only alphanumeric characters are allowed in the username.');
    } else {
      // Check whether the username has already been taken
      let user;

      try {
        user = await userRepo.findByUsername(data.username);
      } catch (e) {
        logger.error(e);
        res.status(500).json({ hasError: 1, error: 'Internal error.' });

        return;
      }

      if (user instanceof User) {
        errors.push('The username has already been taken.');
      }
    }
  }

  // Check whether there is the `password` property
  if (!data.password) {
    errors.push('The password is missing.');
  } else {
    // Check whether the it is valid
    if (data.password.length < 8 || data.password.length > 50) {
      errors.push('The password must be at least 8 and not more than 50 characters long.');
    }
  }

  // For the sake of simplicity we omit a 'passwordConfirmation' field,
  // but it is a good practice to always use it

  if (errors.length > 0) {
    res.status(422).json({ hasError: 1, error: errors.join(' ') });

    return;
  }

  next();
}
