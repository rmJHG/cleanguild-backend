const User = require("../entity/User");

const checkLastCharChangeService = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user.lastCharChangeAt) {
      return false;
    }
    const lastCharChange = new Date(user.lastCharChangeAt);
    const now = new Date();
    if (!lastCharChange) {
      return false;
    }

    const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
    const timeSinceLastChange = now - lastCharChange;

    if (timeSinceLastChange > sevenDaysInMillis) {
      return false;
    }

    console.log(email, "님은 최근 7일 이내에 캐릭터를 변경하셨습니다.");
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = { checkLastCharChangeService };
