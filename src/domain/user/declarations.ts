export type UserData = {
  _id: string,
  email: string,
  password: string,
  username?: string,
};

export type UserCreateData = {
  email: string,
  password: string,
  username?: string,
};

export type UserUpdateData = {
  username?: string,
};
