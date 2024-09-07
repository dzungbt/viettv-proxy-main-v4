'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_controlers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_controlers.init({
    username: DataTypes.STRING,
    lastIpConnected: DataTypes.STRING,
    lastTimeConnected: DataTypes.BIGINT,
    copyrightWarningDetectedCounter: DataTypes.INTEGER,
    copyrightWarningDetectedCounterTimeStamp: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'user_controlers',
  });
  return user_controlers;
};