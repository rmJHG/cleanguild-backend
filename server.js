const express = require("express");
const https = require("https");
const cors = require("cors");
const apiRoutes = require("./src/routes/apiRoutes");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8080;
require("dotenv").config();
require("./src/cron/deleteImageScheduler");
app.use(express.json({ limit: "10mb" })); // JSON 요청 크기 제한 증가
app.use(express.urlencoded({ limit: "10mb", extended: true })); // URL-encoded 요청 크기 제한 증가

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? ["http://localhost:3000", "http://192.168.0.17:3000"]
        : [`https://www.${process.env.CLIENT_URL}`, `https://${process.env.CLIENT_URL}`],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "loginType"],
    exposedHeaders: ["set-cookie"],
  })
);
app.use(cookieParser());

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
app.use("/api/v1", apiRoutes);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
  app.listen(port, () => {
    console.log(`서버가 포트 ${port} 에서 시작되었습니다.`);
  });
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
