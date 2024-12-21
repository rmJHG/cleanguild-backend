const KakaoUser = require("../entity/KakaoUser");
const { compareImagesSSIM } = require("../../../handsData/image/service/ssim");
const { compareFixelDiff } = require("../../../handsData/image/service/fixelDiff");
const User = require("../../local/entity/User");
const { saveFileAndCreateDoc } = require("../../../../middlewares/multer");

const saveHandsImageForKakao = async (email, imageFile, ocid) => {
  const kakaoUser = await KakaoUser.findOne({ email });
  if (!kakaoUser) {
    throw new Error("유저가 존재하지 않습니다.");
  }
  const existingUser = await User.findOne({ ocid });
  const existingKakaoUser = await KakaoUser.findOne({ ocid });
  if (existingUser || existingKakaoUser) {
    const error = new Error("이미 등록된 캐릭터입니다.");
    error.code = 409;
    throw error;
  }

  try {
    const image = await saveFileAndCreateDoc(imageFile, kakaoUser._id);
    if (!image) {
      throw new Error("이미지 저장에 실패했습니다.");
    }
    const ssim = await compareImagesSSIM(image.path);
    const fixelDiff = await compareFixelDiff(image.path);

    const compareResult = {
      ssim: Math.max(...ssim.map((item) => item.ssim)),
      fixelDiff: Math.min(...fixelDiff.map((item) => item.diffRatio)),
    };
    kakaoUser.ocid = ocid;
    kakaoUser.handsImageCompareResult = compareResult;
    await kakaoUser.save();

    return { status: 200, message: "핸즈 이미지 업로드가 완료되었습니다." };
  } catch (error) {
    return error;
  }
};

module.exports = { saveHandsImageForKakao };
