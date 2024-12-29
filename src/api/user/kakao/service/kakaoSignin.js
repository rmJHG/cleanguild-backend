const User = require("../../local/entity/User");
const KakaoUser = require("../entity/KakaoUser");

const kakaoSignIn = async (kakaoData) => {
  console.log(kakaoData);
  const kakaoUser = await KakaoUser.findOne({ email: kakaoData.kakao_account.email });
  const localUser = await User.findOne({ email: kakaoData.kakao_account.email });
  if (localUser) {
    return { message: "로컬 계정으로 로그인해주세요." };
  }
  if (!kakaoUser && !localUser) {
    const user = new KakaoUser({
      email: kakaoData.kakao_account.email,
      role: "user",
      accountType: "kakao",
      isVerified: true,
    });
    await user.save();
    return user;
  }
  return kakaoUser;
};

module.exports = { kakaoSignIn };
