const { Jimp } = require("jimp");
const { getRandomImages } = require("./getRandomImages");

function calculateSSIM(data1, data2, N) {
  let mu1 = 0,
    mu2 = 0,
    sigma1 = 0,
    sigma2 = 0,
    sigma12 = 0;

  for (let i = 0; i < data1.length; i += 4) {
    mu1 += data1[i]; // R 채널
    mu2 += data2[i]; // R 채널
  }
  mu1 /= N;
  mu2 /= N;

  for (let i = 0; i < data1.length; i += 4) {
    const pixel1 = data1[i] - mu1;
    const pixel2 = data2[i] - mu2;
    sigma1 += pixel1 * pixel1;
    sigma2 += pixel2 * pixel2;
    sigma12 += pixel1 * pixel2;
  }
  sigma1 /= N;
  sigma2 /= N;
  sigma12 /= N;

  const C1 = Math.pow(0.01 * 255, 2);
  const C2 = Math.pow(0.03 * 255, 2);
  return ((2 * mu1 * mu2 + C1) * (2 * sigma12 + C2)) / ((mu1 * mu1 + mu2 * mu2 + C1) * (sigma1 + sigma2 + C2));
}

async function getSsim(imageBuffer) {
  const referenceImages = getRandomImages(15);
  try {
    const img1 = await Jimp.read(imageBuffer);
    img1.resize({ w: 50, h: 100 }).greyscale();

    const results = [];
    for (const refImagePath of referenceImages) {
      const img2 = await Jimp.read(refImagePath);
      img2.resize({ w: 50, h: 100 }).greyscale();

      const data1 = img1.bitmap.data;
      const data2 = img2.bitmap.data;
      const ssim = calculateSSIM(data1, data2, data1.length / 4);
      results.push({ ssim });
    }
    return results.sort((a, b) => a.ssim - b.ssim);
  } catch (error) {
    return error;
  }
}

module.exports = {
  getSsim,
};
