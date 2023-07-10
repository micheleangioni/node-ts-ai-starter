export default class CreateUserCommand {
  public readonly email: string;
  public readonly password: string;
  public readonly source: string;
  public readonly username?: string;

  constructor({ email, password, source, username }: {
    email: string;
    password: string;
    source: string;
    username?: string;
  }) {
    this.email = email;
    this.password = password;
    this.source = source;
    this.username = username;
  }
}
