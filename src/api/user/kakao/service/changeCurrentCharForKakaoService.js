const KakaoUser = require("../entity/KakaoUser");

const changeCurrentCharForKakaoService = async (user, currentCharOcid) => {
  const { email } = user;
  console.log(email, "email");
  try {
    const user = await KakaoUser.findOne({ email });
    if (!user) {
      throw new Error("유저를 찾을 수 없습니다.");
    }
    if (!user.currentCharOcid) {
      throw new Error("메인 캐릭터를 먼저 등록해주세요.");
    }

    user.currentCharOcid = currentCharOcid;
    user.lastCharChangeAt = new Date();

    await user.save();

    return "캐릭터 변경이 완료되었습니다.";
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { changeCurrentCharForKakaoService };
