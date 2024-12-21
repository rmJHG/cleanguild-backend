const { createWorker } = require("tesseract.js");
const sharp = require("sharp");

const extractTextFromImage = async (img) => {
  const worker = await createWorker(["kor", "eng"]);

  await worker.setParameters({
    tessedit_pageseg_mode: 3,
  });
  try {
    if (!img) {
      throw new Error("이미지 데이터가 없습니다.");
    }

    const processedImage = await sharp(img.buffer)
      .resize(1000, 1000, { fit: "inside" })
      .grayscale()
      .sharpen()
      .toBuffer();
    const ret = await worker.recognize(processedImage);

    const textArray = ret.data.text.split("\n");

    console.log(textArray);
    const filteredArray = [];

    //정규표현식(num, kor, eng, spec)
    const numberPattern = /\d{4,}/g;
    const koreanPattern = /[가-힣]{2,}/g;
    const englishPattern = /[a-zA-Z]{4,}/g;
    const mixedPattern = /(?=.*[가-힣])(?=.*[a-zA-Z])|(?=.*[가-힣])(?=.*\d)|(?=.*[a-zA-Z])(?=.*\d)/g;
    const maplehandsPattern = /maplehands/;
    const specialCharPattern = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;

    textArray.forEach((text) => {
      const words = text.split(" ");
      const filteredWords = words.filter((word) => {
        if (!specialCharPattern.test(word) && !maplehandsPattern.test(word) && word.length > 1) {
          return (
            numberPattern.test(word) || koreanPattern.test(word) || englishPattern.test(word) || mixedPattern.test(word)
          );
        }
      });
      filteredWords.forEach((e) => {
        e.length >= 1 && filteredArray.push(e);
      });
    });

    console.log(
      filteredArray
        .filter((e) => (e.length > 1 && numberPattern.test(e)) || koreanPattern.test(e) || englishPattern.test(e))
        .sort((a, b) => a.length - b.length)
    );

    console.log(filteredArray);
    const shuffled = filteredArray.sort(() => 0.5 - Math.random());
    console.log(shuffled.slice(0, 10));
    return shuffled.slice(0, 10);
    // return filteredArray;
  } catch (error) {
    throw error;
  } finally {
    await worker.terminate();
  }
};

module.exports = { extractTextFromImage };
