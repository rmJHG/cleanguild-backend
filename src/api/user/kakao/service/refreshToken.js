const jwt = require("jsonwebtoken");
const KakaoUser = require("../entity/KakaoUser");

const refreshTokenService = async (refreshToken) => {
  try {
    console.log("토큰 발급 시작");

    const refresh = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=refresh_token&client_id=${process.env.AUTH_KAKAO_ID}&refresh_token=${refreshToken}&client_secret=${process.env.AUTH_KAKAO_SECRET}`,
    });
    const accessToken = await refresh.json();
    console.log(accessToken, "accessTijeb");

    return { accessToken: accessToken.access_token, message: "새로운 액세스 토큰이 발급되었습니다." };
  } catch (error) {
    return { message: "리프레쉬 토큰이 만료되었습니다." };
  }
};

module.exports = { refreshTokenService };
