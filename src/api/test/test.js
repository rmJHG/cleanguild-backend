const { createWorker } = require("tesseract.js");
const sharp = require("sharp");

const test = async (req, res) => {
  const img = req.file;

  const worker = await createWorker(["kor", "eng"]);

  await worker.setParameters({
    tessedit_pageseg_mode: 12,
  });
  try {
    if (!img) {
      throw new Error("이미지 데이터가 없습니다.");
    }

    const processedImage = await sharp(img.buffer).resize(800, 800, { fit: "inside" }).grayscale().toBuffer();
    const ret = await worker.recognize(processedImage);
    console.log(ret.data.text);
    res.json({ text: ret.data.text });
  } catch (error) {
    console.error("서버 오류:", error);
  } finally {
    await worker.terminate();
  }
};

module.exports = { test };
