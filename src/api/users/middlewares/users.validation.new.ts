import { NextFunction, Request, Response } from 'express';
import validator from 'validator';
import ApplicationError from '../../../application/ApplicationError';
import { ErrorCodes } from '../../../application/declarations';
import UserService from '../../../application/user/userService';

export default async (req: Request, _res: Response, next: NextFunction) => {
  const userService = req.app.get('userService') as UserService;

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

      try {
        await userService.getByEmail(data.email);
        errors.push('The email has already been taken.');
      } catch (error) {
        if (error.status !== 404) {
          return next(error);
        }
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

      try {
        await userService.getByUsername(data.username);
        errors.push('The username has already been taken.');
      } catch (error) {
        if (error.status !== 404) {
          return next(error);
        }
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
    return next(new ApplicationError({
      code: ErrorCodes.INVALID_DATA,
      message: errors.join(' '),
      status: 422,
    }));
  }

  next();
};
