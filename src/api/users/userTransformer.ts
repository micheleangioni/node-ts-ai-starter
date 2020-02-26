import User from '../../domain/user/user';
import {TransformedUser} from './declarations';

export default (user: User): TransformedUser => {
  return {
    email: user.getEmail(),
    username: user.getUsername(),
  };
};
