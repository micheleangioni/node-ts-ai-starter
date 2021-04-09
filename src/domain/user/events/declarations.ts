import { Dayjs } from 'dayjs';

export type UserCreatedData = {
  id: string;
  createdAt: Dayjs;
  email: string;
  username?: string;
};
