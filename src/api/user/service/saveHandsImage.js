const jwt = require("jsonwebtoken");
const User = require("../entity/User");
const { compareImagesSSIM } = require("../../handsData/image/service/ssim");
const { compareFixelDiff } = require("../../handsData/image/service/fixelDiff");

const saveHandsImage = async (accessToken, image) => {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.userId;
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("유저가 존재하지 않습니다.");
  }

  user.handsImage = image.buffer;

  await user.save();

  return { message: "핸즈 이미지 업로드가 완료되었습니다." };
};

module.exports = { saveHandsImage };
