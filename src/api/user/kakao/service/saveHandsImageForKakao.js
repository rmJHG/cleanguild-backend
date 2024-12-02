const KakaoUser = require("../entity/KakaoUser");
const { compareImagesSSIM } = require("../../../handsData/image/service/ssim");
const { compareFixelDiff } = require("../../../handsData/image/service/fixelDiff");

const saveHandsImageForKakao = async (email, image, ocid) => {
  const user = await KakaoUser.findOne({ email });

  if (!user) {
    throw new Error("유저가 존재하지 않습니다.");
  }
  const ssim = await compareImagesSSIM(image);
  const fixelDiff = await compareFixelDiff(image);
  const compareResult = {
    ssim: Math.max(...ssim.map((item) => item.ssim)),
    fixelDiff: Math.min(...fixelDiff),
  };

  user.handsImage = image.buffer;
  user.ocid = ocid;
  user.handsImageCompareResult = compareResult;
  await user.save();

  return { status: 200, message: "핸즈 이미지 업로드가 완료되었습니다." };
};

module.exports = { saveHandsImageForKakao };
