const KakaoUser = require("../entity/KakaoUser");
const User = require("../../local/entity/User");
const { saveFileAndCreateDoc } = require("../../../../middlewares/multer");
const { getSsim } = require("../../../../utils/getSsim");
const { getFixelDiff } = require("../../../../utils/getFixelDiff");

const saveHandsImageForKakao = async (email, imageFile, mainCharOcid, currentCharOcid) => {
  const kakaoUser = await KakaoUser.findOne({ email });
  if (!kakaoUser) {
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
    const image = await saveFileAndCreateDoc(imageFile, kakaoUser._id);
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

    console.log(image.path);

    kakaoUser.handsImage = image.path;
    kakaoUser.mainCharOcid = mainCharOcid;
    kakaoUser.currentCharOcid = currentCharOcid;
    kakaoUser.handsImageCompareResult = compareResult;

    await kakaoUser.save();

    return "핸즈 이미지 업로드가 완료되었습니다.";
  } catch (error) {
    throw error;
  }
};

module.exports = { saveHandsImageForKakao };
