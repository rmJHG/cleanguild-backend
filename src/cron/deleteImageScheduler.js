const cron = require("node-cron");
const fs = require("fs").promises;
const Image = require("../model/imageModel"); // Image 모델 경로에 맞게 수정

const deleteImageScheduler = async () => {
  try {
    console.log("이미지 삭제 스케줄러가 실행되었습니다.");
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const imagesToDelete = await Image.find({ uploadTime: { $lte: oneWeekAgo } });

    for (const image of imagesToDelete) {
      await fs.unlink(image.path);
      await image.deleteOne({ _id: image._id });
      console.log(`이미지 ${image.filename}가 삭제되었습니다.`);
    }
  } catch (error) {
    console.error(`이미지 삭제 중 오류 발생: ${error}`);
  }
};
cron.schedule("0 * * * *", deleteImageScheduler);
