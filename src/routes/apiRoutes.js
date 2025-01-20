const express = require("express");
const { upload, saveImageFile } = require("../middlewares/multer");
const router = express.Router();
//미들웨어
const { kakaoAuthenticateToken } = require("../middlewares/kakaoAuthenticateToken");
const { authenticateToken } = require("../middlewares/authenticateToken");
//컨트롤러
const imageController = require("../api/handsData/image/controller/imageController");
const userLocalController = require("../api/user/local/controller/userLocalController");
const userKakaoController = require("../api/user/kakao/controller/userKakaoController");
const guildController = require("../api/guild/controller/guildController");
const { test } = require("../api/test/test");
const { searchCharDataController, updateCharDataController, getSubCharDataController } = require("../api/char/controller/charDataController");

const checkLoginType = (req, res, next) => {
  const loginType = req.headers["logintype"];
  if (loginType === "local") {
    return authenticateToken(req, res, next);
  } else if (loginType === "kakao") {
    return kakaoAuthenticateToken(req, res, next);
  }
  return res.status(401).json({ message: "올바른 요청이 아닙니다." });
};

//유저 api
router.post("/user/local/checkEmail", userLocalController.checkEmailController);
router.get("/user/local/verifyEmail", userLocalController.verifyEmailController);
router.post("/user/local/resentEmailVerificationCode", userLocalController.resentEmailVerificationCodeController);
router.post("/user/local/signup", userLocalController.signUpController);
router.post("/user/local/signin", userLocalController.signInController);
router.post("/user/local/saveHandsImage", authenticateToken, upload.single("image"), userLocalController.saveHandsImageController);
router.post("/user/local/refreshToken", userLocalController.refreshTokenController);
router.patch("/user/local/changePassword", checkLoginType, userLocalController.changePasswordController);
//카카오 로그인
router.post("/user/kakao/signIn", kakaoAuthenticateToken, userKakaoController.kakaoSignInController);
router.post("/user/kakao/saveHandsImage", kakaoAuthenticateToken, upload.single("image"), userKakaoController.saveHandsImageController);
router.post("/user/kakao/refreshToken", userKakaoController.refreshTokenController);

//이미지 api
router.post("/handsData/image/compare", upload.single("image"), imageController.compareImage);
router.post("/handsData/image/findMainCharacter", upload.single("image"), imageController.findMainCharacter);

//홍보게시글 api
router.post("/guild/local/postGuildRecruitments", checkLoginType, guildController.postGuildRecruitmentsController);
router.post("/guild/kakao/postGuildRecruitments", kakaoAuthenticateToken, guildController.postGuildRecruitmentsController);

//길드 홍보 api
router.post("/guild/getGuildRecruitments", guildController.getGuildRecruitmentsController);
router.post("/guild/getGuildRecruitmentPoster", guildController.getGuildRecruitmentPosterController);
router.post("/guild/getGuildRecruitmentPosterCooltime", guildController.getGuildRecruitmentPosterCooltimeController);
router.patch("/guild/updateGuildRecruitmentPoster", checkLoginType, guildController.updateGuildRecruitmentPosterController);
router.delete("/guild/deleteGuildRecruitmentPoster", checkLoginType, guildController.deleteGuildRecruitmentPosterController);
//길드 관리자 api
router.get("/guild/getUserPostHistory", checkLoginType, guildController.getUserPostHistoryController);
router.get("/guild/getGuildManager", checkLoginType, guildController.getGuildManagerController);
router.post("/guild/postGuildManager", guildController.postGuildManagerController);
router.put("/guild/updateGuildManager", guildController.updateGuildManagerController);
router.delete("/guild/deleteGuildManager", guildController.deleteGuildManagerController);

router.post("/test", upload.single("image"), test);

router.post("/upload", upload.single("image"), async (req, res) => {
  console.log(req.file);

  const save = await saveImageFile(req.file);
  res.json({ url: `/uploads/post/${save.filename}` });
});
//캐릭터 api
router.post("/char/searchCharData", searchCharDataController);
router.put("/char/updateCharData", updateCharDataController);
router.get("/char/getSubCharData", getSubCharDataController);

module.exports = router;
