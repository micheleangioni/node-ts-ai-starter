export type Timestamps = {
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserDomainData = {
  email: string;
  password: string;
  username?: string;
};

export type UserData = UserDomainData & Timestamps & {
  id: number | string;
};
