import { NextFunction, Request, Response } from 'express';
import validator from 'validator';
import ApplicationError from '../../../application/ApplicationError';
import { ErrorCodes } from '../../../application/declarations';
import UserService from '../../../application/user/userService';

export default async (req: Request, _res: Response, next: NextFunction) => {
  const userService = req.app.get('userService') as UserService;

  const data: unknown = req.body;
  const errors = [];

  if (typeof data !== 'object' || !data) {
    return next(new ApplicationError({
      code: ErrorCodes.INVALID_DATA,
      error: 'Invalid input data',
      status: 422,
    }));
  }

  // Check whether there is the `email` property
  const email = String((data as any).email).trim();

  if (!email) {
    errors.push('The email is missing.');
  } else {
    if (!validator.isEmail(email)) {
      errors.push('The email is invalid.');
    } else {
      // Check whether the username has already been taken

      try {
        await userService.getByEmail(email);
        errors.push('The email has already been taken.');
      } catch (error) {
        if (error.status !== 404) {
          return next(error);
        }
      }
    }
  }

  // Check whether there is the `username` property
  const username = String((data as any).username).trim();

  if (username) {
    // Check whether it is a string and a valid username
    if (username.length < 4 || username.length > 25) {
      errors.push('The username must be at least 4 and not more than 25 characters long.');
    } else if (!validator.isAlphanumeric(username)) {
      errors.push('Only alphanumeric characters are allowed in the username.');
    } else {
      // Check whether the username has already been taken

      try {
        await userService.getByUsername(username);
        errors.push('The username has already been taken.');
      } catch (error) {
        if (error.status !== 404) {
          return next(error);
        }
      }
    }
  }

  // Check whether there is the `password` property
  const password = String((data as any).password).trim();

  if (!password) {
    errors.push('The password is missing.');
  } else {
    // Check whether the it is valid
    if (password.length < 8 || password.length > 50) {
      errors.push('The password must be at least 8 and not more than 50 characters long.');
    }
  }

  // For the sake of simplicity we omit a 'passwordConfirmation' field,
  // but it is a good practice to always use it

  if (errors.length > 0) {
    return next(new ApplicationError({
      code: ErrorCodes.INVALID_DATA,
      error: errors.join(' '),
      status: 422,
    }));
  }

  next();
};
