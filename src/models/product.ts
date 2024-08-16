import { Model, DataTypes, Sequelize } from 'sequelize';

class Product extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;

  static associate(models: any) {
    Product.hasMany(models.Stock, {
      foreignKey: 'productId',
      as: 'stocks',
    });
  }
}

export const initializeProductModel = (sequelize: Sequelize) => {
  Product.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    {
      sequelize,
      modelName: 'Product',
    }
  );
};

export default Product;
