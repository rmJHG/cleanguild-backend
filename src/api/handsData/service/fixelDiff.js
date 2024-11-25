const sharp = require("sharp");
const { createCanvas } = require("canvas");
const { getRandomImages } = require("../../../utils/getRandomImages");
const compareFixelDiff = async (uploadedImgBuffer) => {
  const uploadedImg = await sharp(uploadedImgBuffer).resize(300, 500).raw().toBuffer();
  const pixelmatch = (await import("pixelmatch")).default;

  const randomImages = getRandomImages(15);

  const results = [];

  try {
    for (const imgPath of randomImages) {
      // 이미지 리사이즈 (300x500)

      const compareImg = await sharp(imgPath).resize(300, 500).raw().toBuffer();

      // Canvas를 사용하여 픽셀 데이터 비교
      const width = 300;
      const height = 500;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // 업로드된 이미지 데이터
      const img1Data = ctx.createImageData(width, height);
      img1Data.data.set(uploadedImg);
      ctx.putImageData(img1Data, 0, 0);

      // 비교할 이미지 데이터
      const img2Data = ctx.createImageData(width, height);
      img2Data.data.set(compareImg);

      // 차이 이미지 생성
      const diff = ctx.createImageData(width, height);
      const numDiffPixels = pixelmatch(img1Data.data, img2Data.data, diff.data, width, height, { threshold: 0.1 });

      results.push(numDiffPixels);
    }
    return results.sort((a, b) => a - b);
  } catch (error) {
    throw new Error(`이미지 처리 오류: ${error.message}`);
  }
};

module.exports = { compareFixelDiff };
