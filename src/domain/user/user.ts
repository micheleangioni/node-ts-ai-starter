import validator from 'validator';
import { IEntity } from '../declarations';
import { UserData } from './declarations';

export default class User implements IEntity {
  protected id: string;
  protected email: string;
  protected password: string;
  protected username: string | null = null;

  constructor({ _id, email, password, username }: UserData) {
    this.id = _id;
    this.email = email;
    this.password = password;

    if (username) {
      this.username = username;
    }
  }

  public getId(): string {
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

  public getUsername(): string | null {
      return this.username;
  }

  public setUsername(username: string | null) {
      this.username = username;
  }
}
