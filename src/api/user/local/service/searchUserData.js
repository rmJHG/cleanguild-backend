const User = require("../../entity/User");

const searchUserData = async (accessToken) => {
  const user = await User.findOne({ accessToken });
  return user;
};

module.exports = { searchUserData };
