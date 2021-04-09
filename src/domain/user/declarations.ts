import { Dayjs } from 'dayjs';

export type UserDomainData = {
  email: string;
  password: string;
  username?: string;
  createdAt?: Date | Dayjs;
  updatedAt?: Date | Dayjs;
};

export type UserData = UserDomainData & {
  id: number | string;
};
