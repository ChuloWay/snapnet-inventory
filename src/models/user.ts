import { Model, DataTypes, Sequelize } from 'sequelize';

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: string;

  static associate(models: any) {
  }
}

export const initializeUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      username: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
};

export default User;
