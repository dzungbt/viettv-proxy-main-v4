"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class copyrightWarnings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  copyrightWarnings.init(
    {
      username: DataTypes.STRING,
      ipWarning: DataTypes.TEXT,
      timestamp: DataTypes.STRING,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "copyrightWarnings",
    }
  );
  return copyrightWarnings;
};
