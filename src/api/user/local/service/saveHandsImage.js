const { getFixelDiff } = require("../../../../utils/getFixelDiff");
const { getSsim } = require("../../../../utils/getSsim");
const User = require("../entity/User");
const { saveFileAndCreateDoc } = require("../../../../middlewares/multer");
const KakaoUser = require("../../kakao/entity/KakaoUser");

const saveHandsImage = async (userData, imageFile, mainCharOcid, currentCharOcid) => {
  const { userId } = userData;
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("유저가 존재하지 않습니다.");
  }
  const existingUser = await User.findOne({ mainCharOcid });
  const existingKakaoUser = await KakaoUser.findOne({ mainCharOcid });
  if (existingUser || existingKakaoUser) {
    const error = new Error("이미 등록된 캐릭터입니다.");
    error.code = 409;
    throw error;
  }

  try {
    const image = await saveFileAndCreateDoc(imageFile, userId);
    if (!image) {
      throw new Error("이미지 저장에 실패했습니다.");
    }

    const ssim = await getSsim(image.path);
    const fixelDiff = await getFixelDiff(image.path);
    const compareResult = {
      ssim: Math.max(...ssim.map((item) => item.ssim)),
      fixelDiff: Math.min(...fixelDiff.map((item) => item.diffRatio)),
    };
    if (Math.max(...ssim.map((item) => item.ssim)) < 0.3 && Math.min(...fixelDiff.map((item) => item.diffRatio)) < 0.3)
      throw new Error("핸즈 이미지가 아닌 것 같습니다.");
    user.handsImage = image.path;
    user.mainCharOcid = mainCharOcid;
    user.currentCharOcid = currentCharOcid;
    user.handsImageCompareResult = compareResult;
    await user.save();

    return "핸즈 이미지 업로드가 완료되었습니다.";
  } catch (error) {
    return error;
  }
};

module.exports = { saveHandsImage };
