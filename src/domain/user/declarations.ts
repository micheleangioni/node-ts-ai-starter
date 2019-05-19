export type UserData = {
  id: number,
  email: string,
  password: string,
  username: string|undefined|null,
};

export type UserCreateData = {
  email: string,
  password: string,
  username?: string,
};

export type UserUpdateData = {
  username?: string,
};
