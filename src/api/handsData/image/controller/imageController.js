const { compareImagesSSIM } = require("../service/ssim");
const { compareFixelDiff } = require("../service/fixelDiff");

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
  } catch (error) {}
};

module.exports = { compareImage };
