const { Sequelize } = require('sequelize');
require('dotenv').config()
const env = process.env.NODE_ENV || "development";
const config = require('../../config/config.json')[env];
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(config["database"], config["username"], config["password"], {
    host: config["host"],
    dialect: config["dialect"],
    timezone: config["timezone"],
    logging: false,
});


const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;