const sharp = require("sharp");
const { getRandomImages } = require("../../../../utils/getRandomImages");

const compareFixelDiff = async (uploadedImgBuffer) => {
  const width = 300;
  const height = 500;
  const pixelmatch = (await import("pixelmatch")).default;

  // 업로드된 이미지 처리
  const uploadedImg = await sharp(uploadedImgBuffer)
    .resize(width, height)
    .ensureAlpha()  // alpha 채널 추가
    .raw()
    .toBuffer();

  const randomImages = getRandomImages(15);
  const results = [];

  try {
    for (const imgPath of randomImages) {
      // 비교할 이미지 처리
      const compareImg = await sharp(imgPath)
        .resize(width, height)
        .ensureAlpha()  // alpha 채널 추가
        .raw()
        .toBuffer();

      // 픽셀 차이 계산
      const diffCount = pixelmatch(
        new Uint8Array(uploadedImg),
        new Uint8Array(compareImg),
        null,
        width,
        height,
        { threshold: 0.1 }
      );

      results.push(diffCount);
    }

    return results.sort((a, b) => a - b);
  } catch (error) {
    throw new Error("이미지 비교 오류");
  }
};

module.exports = { compareFixelDiff };
