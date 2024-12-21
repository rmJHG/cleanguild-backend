const { compareImagesSSIM } = require("../service/ssim");
const { compareFixelDiff } = require("../service/fixelDiff");
const { extractTextFromImage } = require("../service/extractTextFromImage");
const { getMainChar } = require("../../../../utils/getMainChar");
const { getCharData } = require("../../../../utils/getCharData");
const { findDuplicate } = require("../../../../utils/findDuplicate");
const { getSsim } = require("../../../../utils/getSsim");
const { getFixelDiff } = require("../../../../utils/getFixelDiff");

const compareImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "이미지 파일이 없습니다." });
    }
    const ssim = await compareImagesSSIM(req.file.buffer);
    const fixelDiff = await compareFixelDiff(req.file.buffer);
    const result = {
      ssim: Math.max(...ssim.map((item) => item.ssim)),
      fixelDiff: Math.min(...fixelDiff),
    };

    res.json({ result });
  } catch (error) {
    res.status(500).json(error);
  }
};

const findMainCharacter = async (req, res) => {
  const img = req.file;
  try {
    if (!img) return res.status(400).json({ error: "이미지 오류", message: "이미지 파일이 없습니다." });
    if (!img.mimetype.startsWith("image/"))
      return res.status(400).json({ error: "이미지 오류", message: "유효하지 않은 이미지 형식입니다." });

    const ssim = await getSsim(img.buffer);
    const fixelDiff = await getFixelDiff(img.buffer);

    if (Math.max(...ssim.map((item) => item.ssim)) < 0.3 && Math.min(...fixelDiff.map((item) => item.diffRatio)) < 0.3)
      return res.status(400).json({ error: "이미지 오류", message: "핸즈 이미지가 아닌 것 같습니다." });

    const characterNames = await extractTextFromImage(img.buffer);
    const charsData = await Promise.all(characterNames.map((character_name) => getMainChar(character_name)));
    const duplicateNames = findDuplicate(charsData);
    const result = await Promise.all(duplicateNames.map((character_name) => getCharData(character_name)));
    console.log(
      characterNames,
      Math.max(...ssim.map((item) => item.ssim)),
      Math.min(...fixelDiff.map((item) => item.diffRatio))
    );
    res.json({ result });
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).json({
      error: "서버 오류가 발생했습니다.",
      message: "캐릭터 추출 중 오류가 발생했습니다.",
    });
  }
};

module.exports = { compareImage, findMainCharacter };
