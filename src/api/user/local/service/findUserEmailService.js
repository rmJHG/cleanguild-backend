const { getOcid } = require("../../../../utils/getOcid");
const { maskEmail } = require("../../../../utils/maskEmail");
const User = require("../entity/User");

const findUserEmailService = async (charName) => {
  try {
    const ocid = await getOcid(charName);
    const user = await User.findOne({
      $or: [{ mainCharOcid: ocid }, { currentCharOcid: ocid }],
    });
    if (!user) {
      throw new Error("해당하는 유저를 찾을 수 없습니다.");
    }
    return maskEmail(user.email);
  } catch (error) {
    throw error;
  }
};

module.exports = { findUserEmailService };
