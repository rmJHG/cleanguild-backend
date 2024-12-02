const jwt = require("jsonwebtoken");
const User = require("../entity/User");

const refreshTokenService = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const userId = decoded.userId;
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("유저가 존재하지 않습니다.");
  }

  const accessToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role, ...(user.ocid && { ocid: user.ocid }) },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return { accessToken };
};

module.exports = { refreshTokenService };
