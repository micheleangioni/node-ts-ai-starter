import dayjs, { Dayjs } from 'dayjs';
import { BaseEntity } from '../BaseEntity';
import { IEntity } from '../declarations';
import { UserData } from './declarations';
import { UserCreated } from './events/UserCreated';

export default class User extends BaseEntity implements IEntity {
  private static AGGREGATE_NAME = 'user';
  private readonly id: number | string;
  private readonly email: string;
  private password: string;
  private username?: string;
  private createdAt?: Dayjs;
  private updatedAt?: Dayjs;

  constructor({ id, createdAt, email, password, username, updatedAt }: UserData) {
    super();

    this.id = id;
    this.email = email;
    this.password = password;

    if (username) {
      this.username = username;
    }

    if (createdAt) {
      this.createdAt = dayjs(createdAt);
    }

    if (updatedAt) {
      this.updatedAt = dayjs(updatedAt);
    }
  }

  public getId(): number | string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
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

  public getCreatedAt(): Dayjs | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Dayjs | undefined {
    return this.updatedAt;
  }

  /**
   * Update the createdAt and updatedAt keys.
   * If the createdAt key was not previously set, it means this is being persisted for the first time.
   *
   * @param {Dayjs} date
   * @return void
   */
  public updateDates(date: Dayjs) {
    if (!this.createdAt) {
      this.createdAt = date.clone();

      this.addDomainEvent(new UserCreated(User.AGGREGATE_NAME, {
        createdAt: dayjs(date),
        email: this.email,
        id: this.id.toString(),
        username: this.username,
      }));
    }

    this.updatedAt = date.clone();
  }
}
