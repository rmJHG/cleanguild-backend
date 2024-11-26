const express = require("express");
const cors = require("cors");
const apiRoutes = require("./src/routes/apiRoutes");
const mongoose = require("mongoose");

const app = express();
const port = 8080;
require("dotenv").config();

app.use(cors());
app.use(express.json());
if (!process.env.MONGO_URL) {
  console.error("MONGO_URL이 설정되지 않았습니다.");
  process.exit(1);
}

// MongoDB 연결 시도
mongoose.connect(process.env.MONGO_URL).catch((err) => {
  console.error("MongoDB 초기 연결 실패:", err);
  process.exit(1);
});
// Routes
app.use("/api", apiRoutes);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port} 에서 시작되었습니다.`);
});
