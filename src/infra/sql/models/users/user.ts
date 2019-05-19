import { Model } from 'sequelize';

class User extends Model {
  public id!: number; // The `null assertion` `!` is required in strict mode.
  public email!: string;
  public password!: string;
  public username!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default User;
