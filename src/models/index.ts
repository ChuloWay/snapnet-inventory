import { Sequelize } from "sequelize";
import User, { initializeUserModel } from "./user";
import Product, { initializeProductModel } from "./product";
import Warehouse, { initializeWarehouseModel } from "./warehouse";
import Stock, { initializeStockModel } from "./stock";

import dotenv from "dotenv";


dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;



const sequelize = new Sequelize(
  `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    dialect: "mysql",
    logging: console.log, 
  }
);

// Initialize models
initializeUserModel(sequelize);
initializeProductModel(sequelize);
initializeWarehouseModel(sequelize);
initializeStockModel(sequelize);

// Set up model associations
User.associate({ Stock });
Product.associate({ Stock });
Warehouse.associate({ Stock });
Stock.associate({ Product, Warehouse });

// Sync models with the database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Error syncing database:", error);
    process.exit(1);
  }
};

export { sequelize, syncDatabase, User, Product, Warehouse, Stock };
