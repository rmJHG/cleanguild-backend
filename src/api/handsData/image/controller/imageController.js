const { compareImagesSSIM } = require("../service/ssim");
const { compareFixelDiff } = require("../service/fixelDiff");
const { extractTextFromImage } = require("../service/extractTextFromImage");
const { getMainChar } = require("../../../../utils/getMainChar");
const { getCharData } = require("../../../../utils/getCharData");
const { findDuplicate } = require("../../../../utils/findDuplicate");

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
  try {
    if (!req.file) {
      return res.status(400).json({ error: "이미지 파일이 없습니다." });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "유효하지 않은 이미지 형식입니다." });
    }

    const characterNames = await extractTextFromImage(req.file.buffer);
    console.log(characterNames);
    const charsData = await Promise.all(characterNames.map((character_name) => getMainChar(character_name)));
    console.log("charsData", charsData);

    const duplicateNames = findDuplicate(charsData);
    console.log("duplicateNames", duplicateNames);

    const result = await Promise.all(duplicateNames.map((character_name) => getCharData(character_name)));

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
