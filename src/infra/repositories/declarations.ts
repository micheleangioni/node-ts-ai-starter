import { UserDomainData } from '../../domain/user/declarations';
import { ObjectID } from 'mongodb';

export type ToBePersistedUserMongoData = UserDomainData & {
  _id: string;
};

export type PersistedUserMongoData = {
  _id: ObjectID;
  email: string;
  password: string;
  username?: string;
  createdAt: Date;
  updatedAt: Date;
};
