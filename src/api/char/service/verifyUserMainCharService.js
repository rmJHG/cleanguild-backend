const { getCharDataForOcid } = require("../../../utils/getCharDataForOcid");
const { getMainChar } = require("../../../utils/getMainChar");
const KakaoUser = require("../../user/kakao/entity/KakaoUser");
const User = require("../../user/local/entity/User");

const verifyUserMainCharService = async (email, charName, loginType) => {
  try {
    let user;
    if (loginType === "local") {
      user = await User.findOne({ email });
    } else if (loginType === "kakao") {
      user = await KakaoUser.findOne({ email });
    }

    if (!user) {
      throw new Error("유저를 찾을 수 없습니다.");
    }

    const userMainCharData = await getCharDataForOcid(user.mainCharOcid);
    const currentMainCharData = await getMainChar(charName);

    if (userMainCharData.character_name !== currentMainCharData) {
      throw new Error("메인 캐릭터가 아닙니다.");
    }

    return "메인 캐릭터 입니다.";
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { verifyUserMainCharService };
