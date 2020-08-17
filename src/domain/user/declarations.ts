import {Moment} from 'moment';

export type UserDomainData = {
  email: string;
  password: string;
  username?: string;
  createdAt?: Date | Moment;
  updatedAt?: Date | Moment;
};

export type UserData = UserDomainData & {
  id: number | string;
};
