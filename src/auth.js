const db = require('../models/index');
const constants = require('../src/config/constants/constants');
const {Redis} = require('./redis/redis')

const auth = async (username, password) => {
  try {
    const redisClient = new Redis
    const users = await redisClient.get('usersData')
    redisClient.clearClient()
    let usersJson = JSON.parse(users)
    const user = usersJson.find((user) => user.username == username && user.password == password)
    console.log('user found : ', user);
    // console.log('constants found : ', constants.USER_ACTIVE);

    if (user) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
};

module.exports = auth;
