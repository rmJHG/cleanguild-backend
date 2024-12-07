const sharp = require("sharp");
const { getRandomImages } = require("./getRandomImages");

const getFixelDiff = async (uploadedImgBuffer) => {
  const width = 300;
  const height = 500;
  
  const uploadedImg = await sharp(uploadedImgBuffer)
    .resize(width, height)
    .grayscale()
    .raw()
    .toBuffer();

  const randomImages = getRandomImages(15);
  const results = [];

  try {
    for (const imgPath of randomImages) {
      const compareImg = await sharp(imgPath)
        .resize(width, height)
        .grayscale()
        .raw()
        .toBuffer();

      let diffCount = 0;
      const threshold = 30; // 픽셀 차이 임계값

      // 픽셀 단위로 비교
      for (let i = 0; i < uploadedImg.length; i++) {
        const diff = Math.abs(uploadedImg[i] - compareImg[i]);
        if (diff > threshold) {
          diffCount++;
        }
      }

      // 차이 비율 계산 (0~1 사이 값)
      const diffRatio = 1 - (diffCount / (width * height));
      results.push({ diffRatio });
    }

    return results.sort((a, b) => b.diffRatio - a.diffRatio);
  } catch (error) {
    throw new Error("이미지 비교 중 오류가 발생했습니다.");
  }
};

module.exports = { getFixelDiff };
