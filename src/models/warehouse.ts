import { Model, DataTypes, Sequelize } from 'sequelize';

class Warehouse extends Model {
  public id!: number;
  public name!: string;
  public location!: string;

  static associate(models: any) {
    Warehouse.hasMany(models.Stock, {
      foreignKey: 'warehouseId',
      as: 'stocks',
    });
  }
}

export const initializeWarehouseModel = (sequelize: Sequelize) => {
  Warehouse.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      location: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Warehouse',
    }
  );
};

export default Warehouse;