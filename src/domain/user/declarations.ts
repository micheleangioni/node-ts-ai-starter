export type UserDomainData = {
  email: string;
  password: string;
  username?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserData = UserDomainData & {
  id: number | string;
};

export type UserCreateData = {
  email: string;
  password: string;
  username?: string;
};

export type UserUpdateData = {
  username?: string;
};
