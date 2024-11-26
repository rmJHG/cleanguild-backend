const multer = require("multer");
const storage = multer.memoryStorage();
const fs = require("fs").promises;
const path = require("path");
const User = require("../api/user/entity/User");

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("이미지 파일만 업로드 가능합니다."), false);
    }
    cb(null, true);
  },
});

const saveFileAndCreateDoc = async (buffer, fileInfo, userId) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename = uniqueSuffix + path.extname(fileInfo.originalname);
  const filepath = path.join("uploads", filename);

  // 파일 저장
  await fs.writeFile(filepath, buffer);

  // DB에 이미지 문서 생성
  const image = new Image({
    filename: filename,
    path: filepath,
    originalname: fileInfo.originalname,
    mimetype: fileInfo.mimetype,
    size: buffer.length,
  });

  await image.save();

  // User 문서에 이미지 추가
  await User.findByIdAndUpdate(userId, { $push: { handsImages: image._id } }, { new: true });

  return image;
};
module.exports = { upload, saveFileAndCreateDoc };
