import { UserDomainData } from '../../domain/user/declarations';

export type ToBePersistedUserMongoData = UserDomainData & {
  _id: string;
};

export type PersistedUserMongoData = {
  _id: string;
  email: string;
  password: string;
  username?: string;
  createdAt: Date;
  updatedAt: Date;
};
