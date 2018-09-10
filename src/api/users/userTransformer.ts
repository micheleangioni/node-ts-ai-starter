import User from '../../domain/user/user';

export default function transform(user: User): object {
  return {
    email: user.getEmail(),
    username: user.getUsername(),
  };
}
