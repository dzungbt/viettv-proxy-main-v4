module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "users",
          "watching",
          {
            type: Sequelize.DataTypes.INTEGER,
            defaultValue: 0
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "users",
          "ipsWatching",
          {
            type: Sequelize.DataTypes.STRING,
            defaultValue: ''
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "users",
          "numberDevicesAllowOneTime",
          {
            type: Sequelize.DataTypes.INTEGER,
            defaultValue: 1
          },
          { transaction: t }
        ),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("users", "watching", { transaction: t }),
        queryInterface.removeColumn("users", "ipsWatching", { transaction: t }),
        queryInterface.removeColumn("users", "numberDevicesAllowOneTime", { transaction: t }),

      ]);
    });
  },
};
