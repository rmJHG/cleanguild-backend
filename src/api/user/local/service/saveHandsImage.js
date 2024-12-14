const { getFixelDiff } = require("../../../../utils/getFixelDiff");
const { getSsim } = require("../../../../utils/getSsim");
const User = require("../entity/User");
const { saveFileAndCreateDoc } = require("../../../../middlewares/multer");

const saveHandsImage = async (userData, imageFile, ocid) => {
  const { userId } = userData;
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("유저가 존재하지 않습니다.");
  }
  const existingUser = await User.findOne({ ocid });
  if (existingUser) {
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
      fixelDiff: Math.min(...fixelDiff),
    };

    user.handsImage = image.path;
    user.ocid = ocid;
    user.handsImageCompareResult = compareResult;
    await user.save();

    return { status: 200, message: "핸즈 이미지 업로드가 완료되었습니다." };
  } catch (error) {
    return error;
  }
};

module.exports = { saveHandsImage };
