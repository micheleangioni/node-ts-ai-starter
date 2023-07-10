import UserService from '../userService';
import CreateUserCommand from '../commands/createUserCommand';
import IHandler from '../../IHandler';
import User from '../../../domain/user/user';

export class CreateUserCommandHandler implements IHandler {
  constructor(private readonly userService: UserService) {}
  async handle({email, password, source, username}: CreateUserCommand): Promise<User> {
    return await this.userService.createUser({
      email,
      password,
      username,
    }, source);
  }
}
