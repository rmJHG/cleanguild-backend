const { mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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
  },
  handsImage: {
    type: Buffer,
    contentType: String,
    originalname: String,
  },
  handsImageDiff: {
    type: Object,
  },
});

module.exports = mongoose.model("User", userSchema);
