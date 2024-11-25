const express = require("express");
const { upload } = require("../middlewares/multer");
const router = express.Router();

const handsDataController = require("../api/handsData/controller/handsDataController");

//유저 관련 api
//이미지 유사도 측정 api
router.post("/handsData/image/getSsim", upload.single("image"), handsDataController.getSsimsData);
router.post("/handsData/image/getFixelDiff", upload.single("image"), handsDataController.getFixelDiffData);

module.exports = router;
