import { Moment } from 'moment';

export type UserCreatedData = {
  id: string;
  createdAt: Moment;
  email: string;
  username?: string;
};
