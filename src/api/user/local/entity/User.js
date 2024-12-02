const { mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
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
  ocid: {
    type: String,
    unique: true,
    sparse: true,
  },
  handsImage: {
    type: Buffer,
    contentType: String,
    originalname: String,
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
    default: "local",

    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
