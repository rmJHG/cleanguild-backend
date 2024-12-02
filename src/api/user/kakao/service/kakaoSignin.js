const KakaoUser = require("../entity/KakaoUser");

const kakaoSignIn = async (kakaoData) => {
  console.log(kakaoData);
  const user = await KakaoUser.findOne({ email: kakaoData.kakao_account.email });
  if (!user) {
    const user = new KakaoUser({
      email: kakaoData.kakao_account.email,
      role: "user",
      accountType: "kakao",
      isVerified: true,
    });
    await user.save();
    return { message: "회원가입이 완료되었습니다." };
  }
  return user;
};

module.exports = { kakaoSignIn };
