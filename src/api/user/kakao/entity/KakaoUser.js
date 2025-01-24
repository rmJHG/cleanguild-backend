const { mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
    required: true,
  },
  refreshToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  mainCharOcid: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  currentCharOcid: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  handsImage: {
    type: String,
  },
  handsImageCompareResult: {
    type: Object,
  },
  handsImageDiff: {
    type: Object,
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  accountType: {
    type: String,
    default: "kakao",
    required: true,
  },
});

module.exports = mongoose.model("KakaoUser", userSchema);
