const mongoose = require("mongoose");

// 이미지 스키마 정의
const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true }, // 파일 이름
  path: { type: String, required: true }, // 파일 경로
  uploadTime: { type: Date, default: Date.now }, // 업로드 시간
});

// 모델 생성
const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
