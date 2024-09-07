const db = require('../models/index');
const constants = require('../src/config/constants/constants');

const auth = async (username, password) => {
  try {
    const user = await db.users.findOne({ where: { username: username } });
    // console.log('user found : ', user);
    // console.log('constants found : ', constants.USER_ACTIVE);

    if (user) {
      if (user.password == password) {
        if (user.active == constants.USER_ACTIVE) {
          return user;
        }
        return null;
      }
      return null;
    }
    return null;
  } catch {
    return null;
  }
};

module.exports = auth;
