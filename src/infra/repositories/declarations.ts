import { UserDomainData } from '../../domain/user/declarations';
import { ObjectId } from 'mongodb';

export type ToBePersistedUserMongoData = UserDomainData & {
  _id: string;
};

export type PersistedUserMongoData = {
  _id: ObjectId;
  email: string;
  password: string;
  username?: string;
  createdAt: Date;
  updatedAt: Date;
};
