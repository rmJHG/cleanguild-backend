const { getFixelDiff } = require("../../../../utils/getFixelDiff");
const { getSsim } = require("../../../../utils/getSsim");
const User = require("../entity/User");

const saveHandsImage = async (userData, image, ocid) => {
  console.log(userData);
  const { userId } = userData;
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("유저가 존재하지 않습니다.");
  }
  const ssim = await getSsim(image);
  const fixelDiff = await getFixelDiff(image);
  const compareResult = {
    ssim: Math.max(...ssim.map((item) => item.ssim)),
    fixelDiff: Math.min(...fixelDiff),
  };

  user.handsImage = image;
  user.ocid = ocid;
  user.handsImageCompareResult = compareResult;
  await user.save();

  return { status: 200, message: "핸즈 이미지 업로드가 완료되었습니다." };
};

module.exports = { saveHandsImage };
