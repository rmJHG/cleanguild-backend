const User = require("../../local/entity/User");
const KakaoUser = require("../entity/KakaoUser");

const kakaoSignIn = async (kakaoData) => {
  try {
    const localUser = await User.findOne({ email: kakaoData.kakao_account.email });
    if (localUser) {
      throw new Error("로컬 계정이 존재합니다. 일반로그인으로 로그인해주세요.");
    }
    const kakaoUser = await KakaoUser.findOne({ email: kakaoData.kakao_account.email });
    if (kakaoUser && kakaoUser.deleteRequestAt) {
      return {
        ...kakaoUser._doc,
        deleteRequest: true,
      };
    }

    if (!kakaoUser && !localUser) {
      const newUser = new KakaoUser({
        email: kakaoData.kakao_account.email,
        role: "user",
        accountType: "kakao",
        isVerified: true,
      });
      await newUser.save();
      return newUser._doc;
    }
    return kakaoUser._doc;
  } catch (error) {
    throw error;
  }
};

module.exports = { kakaoSignIn };
