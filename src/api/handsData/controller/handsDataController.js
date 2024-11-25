const ssim = require("../service/ssim");
const fixelDiff = require("../service/fixelDiff");
getSsimsData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "이미지 파일이 없습니다." });
    }

    const result = await ssim.compareImagesSSIM(req.file.buffer);
    res.json({ result });
  } catch (error) {
    console.error("에러:", error);
    res.status(500).json({ error: `이미지 비교 오류: ${error.message}` });
  }
};

getFixelDiffData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "이미지 파일이 없습니다." });
    }
    const result = await fixelDiff.compareFixelDiff(req.file.buffer);
    res.json({ result });
  } catch (error) {
    console.error("에러:", error);
    res.status(500).json({ error: `이미지 비교 오류: ${error.message}` });
  }
};

module.exports = { getSsimsData, getFixelDiffData };
