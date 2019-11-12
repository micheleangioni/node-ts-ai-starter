import validator from 'validator';
import { IEntity } from '../declarations';
import { UserData } from './declarations';

export default class User implements IEntity {
  private readonly id: number | string;
  private email: string;
  private password: string;
  private username?: string;

  constructor({ id, email, password, username }: UserData) {
    this.id = id;
    this.email = email;
    this.password = password;

    if (username) {
      this.username = username;
    }
  }

  public getId(): number | string {
    return this.id;
  }

  public getEmail(): string {
      return this.email;
  }

  public setEmail(email: string) {
      if (!validator.isEmail(email)) {
        throw new Error('Invalid input email');
      }

      this.email = email;
  }

  public getPassword(): string {
      return this.password;
  }

  public setPassword(password: string) {
      this.password = password;
  }

  public getUsername(): string | undefined {
      return this.username;
  }

  public setUsername(username: string | undefined) {
      this.username = username;
  }
}
