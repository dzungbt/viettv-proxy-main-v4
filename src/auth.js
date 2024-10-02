const db = require('../models/index');
const constants = require('../src/config/constants/constants');
const {Redis} = require('./redis/redis')

const auth = async (username, password) => {
  try {
    const redisClient = new Redis
    const users = await redisClient.get('usersData')
    redisClient.clearClient()
    console.log('users raw: ', users)

    if (!users?.data) {
      console.log('not found userData : ')
      return null
    }
    let usersJson = JSON.parse(users?.data)
    const user = usersJson.find((user) => user.username == username && user.password == password)
    console.log('user found : ', user);

    if (user) {
      return user;
    }
    return null;
  } catch (e) {
    console.log('error in auth : ', e)
    return null;
  }
};

module.exports = auth;
