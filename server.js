const express = require("express");
const cors = require("cors");
const apiRoutes = require("./src/routes/apiRoutes");

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`서버가 포트 ${port} 에서 시작되었습니다.`);
});
