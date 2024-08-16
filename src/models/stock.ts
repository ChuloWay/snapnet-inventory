import { Model, DataTypes, Sequelize } from 'sequelize';

class Stock extends Model {
  public id!: number;
  public productId!: number;
  public warehouseId!: number;
  public quantity!: number;

  static associate(models: any) {
    Stock.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
    Stock.belongsTo(models.Warehouse, {
      foreignKey: 'warehouseId',
      as: 'warehouse',
    });
  }
}

export const initializeStockModel = (sequelize: Sequelize) => {
  Stock.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Products',
          key: 'id',
        },
        allowNull: false,
      },
      warehouseId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Warehouses',
          key: 'id',
        },
        allowNull: false,
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Stock',
    }
  );
};

export default Stock;
