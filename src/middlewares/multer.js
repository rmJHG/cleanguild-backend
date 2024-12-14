const multer = require("multer");
const storage = multer.memoryStorage();
const fs = require("fs").promises;
const path = require("path");

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

const saveFileAndCreateDoc = async (file, userId) => {
  console.log(file, userId);
  const buffer = file.buffer;
  if (!file || !file.originalname) {
    throw new Error("파일 정보가 유효하지 않습니다.");
  }

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename = uniqueSuffix + path.extname(file.originalname);
  const userDir = path.join("uploads", "handsImage", userId.toString());

  // 사용자 디렉토리가 존재하지 않으면 생성
  await fs.mkdir(userDir, { recursive: true });

  const filepath = path.join(userDir, filename);

  // 파일 저장
  await fs.writeFile(filepath, buffer);

  return { path: filepath, filename };
};

module.exports = { upload, saveFileAndCreateDoc };
