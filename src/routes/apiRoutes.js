const express = require("express");
const { upload } = require("../middlewares/multer");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authenticateToken");
//컨트롤러
const imageController = require("../api/handsData/image/controller/imageController");
const userController = require("../api/user/controller/userController");

//유저 api
router.post("/user/signUp", userController.signUpController);
router.post("/user/signIn", userController.signInController);
router.post("/user/saveHandsImage", authenticateToken, upload.single("image"), userController.saveHandsImageController);
router.post("/user/refreshToken", userController.refreshTokenController);
//이미지 api
router.post("/handsData/image/compare", upload.single("image"), imageController.compareImage);

module.exports = router;
