const User = require("../entity/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const KakaoUser = require("../../kakao/entity/KakaoUser");

const signIn = async (email, password) => {
  try {
    const kakaoUser = await KakaoUser.findOne({
      email,
    });
    if (kakaoUser) {
      throw new Error("카카오 계정으로 로그인해주세요.");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("존재하지 않는 이메일입니다.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    const isVerified = user.isVerified;
    if (!isPasswordValid) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
    if (!isVerified) {
      throw new Error("이메일 인증을 완료해주세요.");
    }
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, ...(user.ocid && { ocid: user.ocid }) },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    let refreshToken = user.refreshToken;
    let needsNewRefreshToken = false;
    let message = "로그인이 완료되었습니다.";
    // 리프레시 토큰 검증 또는 새로 발급
    if (refreshToken) {
      try {
        jwt.verify(refreshToken, process.env.JWT_SECRET);
      } catch (error) {
        needsNewRefreshToken = true;
      }
    } else {
      needsNewRefreshToken = true;
    }

    // 필요한 경우에만 새로운 리프레시 토큰 발급
    if (needsNewRefreshToken) {
      console.log("로그인시도 : 새로운 리프레시 토큰 발급");
      refreshToken = jwt.sign(
        { userId: user._id, email: user.email, role: user.role, ...(user.ocid && { ocid: user.ocid }) },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      await User.findOneAndUpdate({ email }, { refreshToken });
      message = "새로운 리프레시 토큰이 발급되었습니다.";
    }

    return {
      message,
      email: user.email,
      accessToken,
      refreshToken,
      ocid: user.ocid,
      isVerified: user.isVerified,
    };
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "로그인 중 오류가 발생했습니다.");
  }
};

module.exports = { signIn };
