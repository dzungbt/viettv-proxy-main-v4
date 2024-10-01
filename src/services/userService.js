const {Redis} = require('../redis/redis')
const db = require("../../models/index");
const { Op } = require("sequelize");
const constants = require("../config/constants/constants");

async function getUsersData () {
    console.log('load users');
    const redisClient = new Redis
    try {
        const users = await db.users.findAll({
            where: {
              active: 1,
            },
          })
        redisClient.set('usersData', users)
    } catch (e) {
        console.log('error in get users : ', e)
    }
    redisClient.clearClient()

}


module.exports = {
    getUsersData: getUsersData,
}