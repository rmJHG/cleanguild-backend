const jwt = require("jsonwebtoken");
const User = require("../entity/User");

const refreshTokenService = async (refreshToken) => {
  try {
    const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log(decodedRefreshToken);
    const userId = await decodedRefreshToken.userId;
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
    if (error.name === "TokenExpiredError") {
      return { message: "리프레쉬 토큰이 만료되었습니다." };
    }
  }
};

module.exports = { refreshTokenService };
