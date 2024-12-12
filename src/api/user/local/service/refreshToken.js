const jwt = require("jsonwebtoken");
const User = require("../entity/User");

const refreshTokenService = async (refreshToken) => {
  try {
    console.log("토큰 발급 시작");
    const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const userId = decodedRefreshToken.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("유저가 존재하지 않습니다.");
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, ...(user.ocid && { ocid: user.ocid }) },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { accessToken, message: "새로운 액세스 토큰이 발급되었습니다." };
  } catch (error) {
    return { message: "토큰 재발급에 실패했습니다." };
  }
};

module.exports = { refreshTokenService };
