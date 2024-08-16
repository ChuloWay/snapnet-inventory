module.exports = {
  // Define the migration for inserting sample data into the Users table
  up: async (queryInterface, Sequelize) => {
    // Insert a sample user into the Users table
    await queryInterface.bulkInsert("Users", [
      {
        firstName: "Anom",
        lastName: "Warbhuvan",
        email: "anomwarbhuvan91.com",
        password: "xyz321",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  // Define the migration for deleting all data from the Users table
  down: async (queryInterface, Sequelize) => {
    // Delete all rows from the Users table
    await queryInterface.bulkDelete("Users", null, {});
  },
};
