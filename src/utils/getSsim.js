const sharp = require("sharp");
const { getRandomImages } = require("./getRandomImages");

function calculateSSIM(data1, data2, N) {
  let mu1 = 0,
    mu2 = 0,
    sigma1 = 0,
    sigma2 = 0,
    sigma12 = 0;

  // Sharp는 단일 채널로 반환
  for (let i = 0; i < data1.length; i++) {
    mu1 += data1[i];
    mu2 += data2[i];
  }
  mu1 /= N;
  mu2 /= N;

  for (let i = 0; i < data1.length; i++) {
    const pixel1 = data1[i] - mu1;
    const pixel2 = data2[i] - mu2;
    sigma1 += pixel1 * pixel1;
    sigma2 += pixel2 * pixel2;
    sigma12 += pixel1 * pixel2;
  }
  sigma1 /= N - 1;
  sigma2 /= N - 1;
  sigma12 /= N - 1;

  const C1 = Math.pow(0.01 * 255, 2);
  const C2 = Math.pow(0.03 * 255, 2);

  const ssim = ((2 * mu1 * mu2 + C1) * (2 * sigma12 + C2)) / ((mu1 * mu1 + mu2 * mu2 + C1) * (sigma1 + sigma2 + C2));

  return Math.max(0, Math.min(1, ssim)); // 0~1 사이로 제한
}

async function getSsim(imageBuffer) {
  console.log(imageBuffer, "hellow");
  const referenceImages = getRandomImages(15);
  try {
    const img1Buffer = await sharp(imageBuffer).resize(50, 100).grayscale().raw().toBuffer();
    console.log("img1Buffer 길이:", img1Buffer.length); // img1Buffer 길이 로그 추가

    const results = [];
    for (const refImagePath of referenceImages) {
      const img2Buffer = await sharp(refImagePath).resize(50, 100).grayscale().raw().toBuffer();
      console.log("img2Buffer 길이:", img2Buffer.length); // img2Buffer 길이 로그 추가

      const ssim = calculateSSIM(img1Buffer, img2Buffer, 50 * 100);
      results.push({ ssim });
    }
    return results.sort((a, b) => b.ssim - a.ssim); // 내림차순 정렬 (높은 유사도가 앞으로)
  } catch (error) {
    console.log(error);
    throw new Error("이미지 비교 중 오류가 발생했습니다.");
  }
}

module.exports = {
  getSsim,
};
