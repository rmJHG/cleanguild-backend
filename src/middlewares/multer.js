const multer = require("multer");
const storage = multer.memoryStorage();
const fs = require("fs").promises;
const path = require("path");
const Image = require("../model/imageModel");

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
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
  const baseDir =
    process.env.NODE_ENV === "production" ? "/home/jhg990508/cleanguild-static/images/user-hands" : path.join(__dirname, "../../images/handsImage");

  const userDir = path.join(baseDir, userId.toString());

  // 사용자 디렉토리가 존재하지 않으면 생성
  await fs.mkdir(userDir, { recursive: true });

  const filepath = path.join(userDir, filename);

  // 파일 저장
  await fs.writeFile(filepath, buffer);

  return { path: filepath, filename };
};

const saveImageFile = async (file) => {
  const buffer = file.buffer;
  if (!file || !file.originalname) {
    throw new Error("파일 정보가 유효하지 않습니다.");
  }

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename = uniqueSuffix + path.extname(file.originalname);

  const baseDir = process.env.NODE_ENV === "development" ? path.join(__dirname, "../../images/post") : "/home/jhg990508/cleanguild-static/images/post";

  const userDir = path.join(baseDir);

  // 사용자 디렉토리가 존재하지 않으면 생성
  await fs.mkdir(userDir, { recursive: true });

  const filepath = path.join(userDir, filename);

  // 파일 저장
  await fs.writeFile(filepath, buffer);
  const uploadTime = Date.now();

  const newImage = new Image({
    filename: filename, // 파일 이름
    path: filepath, // 파일 경로
    uploadTime: uploadTime, // 업로드 시간
  });
  await newImage.save();
  return { path: filepath, filename };
};

module.exports = { upload, saveFileAndCreateDoc, saveImageFile };
