import { Moment } from 'moment';
import { BaseEvent } from '../../BaseEvent';
import { IDomainEvent } from '../../IDomainEvent';
import { UserCreatedData } from './declarations';

export class UserCreated extends BaseEvent implements IDomainEvent {
  public readonly id: string;
  public readonly createdAt: Moment;
  public readonly email: string;
  public readonly username?: string;
  private readonly eventName = 'UserCreated';

  constructor(aggregate: string, { id, createdAt, email, username }: UserCreatedData) {
    super(aggregate);

    this.id = id;
    this.createdAt = createdAt;
    this.email = email;
    this.username = username;
  }

  public getEventName(): string {
    return this.eventName;
  }

  public getEventData() {
    return {
      createdAt: this.createdAt.toISOString(),
      email: this.email,
      id: this.id,
      username: this.username,
    };
  }
}
