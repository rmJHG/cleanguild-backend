const { createWorker } = require("tesseract.js");

const extractTextFromImage = async (img) => {
  const worker = await createWorker(["kor", "eng"]);
  await worker.load();
  try {
    if (!img) {
      throw new Error("이미지 데이터가 없습니다.");
    }

    const base64Image = `data:image/jpeg;base64,${img.toString("base64")}`;
    const ret = await worker.recognize(base64Image);

    const textArray = ret.data.text.split("\n");

    const filteredArray = [];

    //정규표현식(num, kor, eng, spec)
    const numberPattern = /\d{4,}/g;
    const koreanPattern = /[가-힣]{2,}/g;
    const englishPattern = /[a-zA-Z]{4,}/g;
    const specialCharPattern = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;

    textArray.forEach((text) => {
      const words = text.split(" ");
      const filteredWords = words.filter((word) => {
        if (!specialCharPattern.test(word)) {
          return numberPattern.test(word) || koreanPattern.test(word) || englishPattern.test(word);
        }
      });
      filteredWords.forEach((e) => {
        e.length >= 1 && filteredArray.push(e);
      });
    });
    await worker.terminate();
    const shuffled = filteredArray.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  } catch (error) {
    if (worker) {
      await worker.terminate();
    }
    throw error;
  }
};

module.exports = { extractTextFromImage };
