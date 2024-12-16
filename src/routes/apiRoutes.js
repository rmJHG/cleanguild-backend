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

const checkLoginType = (req, res, next) => {
  const loginType = req.headers["logintype"];
  if (loginType === "local") {
    return authenticateToken(req, res, next);
  } else if (loginType === "kakao") {
    return kakaoAuthenticateToken(req, res, next);
  }
};
//유저 api
router.post("/user/local/checkEmail", userLocalController.checkEmailController);
router.get("/user/local/verifyEmail", userLocalController.verifyEmailController);
router.post("/user/local/resentEmailVerificationCode", userLocalController.resentEmailVerificationCodeController);
router.post("/user/local/signup", userLocalController.signUpController);
router.post("/user/local/signin", userLocalController.signInController);
router.post(
  "/user/local/saveHandsImage",
  authenticateToken,
  upload.single("image"),
  userLocalController.saveHandsImageController
);
router.post("/user/local/refreshToken", userLocalController.refreshTokenController);

//카카오 로그인
router.post("/user/kakao/signIn", kakaoAuthenticateToken, userKakaoController.kakaoSignInController);
router.post(
  "/user/kakao/saveHandsImage",
  kakaoAuthenticateToken,
  upload.single("image"),
  userKakaoController.saveHandsImageController
);
router.post("/user/kakao/refreshToken", userKakaoController.refreshTokenController);

//이미지 api
router.post("/handsData/image/compare", upload.single("image"), imageController.compareImage);
router.post("/handsData/image/findMainCharacter", upload.single("image"), imageController.findMainCharacter);

//홍보게시글 api
router.post("/guild/local/postGuildRecruitments", checkLoginType, guildController.postGuildRecruitmentsController);
router.post(
  "/guild/kakao/postGuildRecruitments",
  kakaoAuthenticateToken,
  guildController.postGuildRecruitmentsController
);
router.post("/guild/getGuildRecruitments", guildController.getGuildRecruitmentsController);
router.post("/guild/getGuildRecruitmentPoster", guildController.getGuildRecruitmentPosterController);
router.post("/guild/getGuildRecruitmentPosterCooltime", guildController.getGuildRecruitmentPosterCooltimeController);

router.post("/test", authenticateToken, (req, res) => {
  res.json({ message: "test" });
});
router.post("/upload", upload.single("image"), async (req, res) => {
  console.log(req.file);

  const save = await saveImageFile(req.file);
  res.json({ url: `/uploads/post/${save.filename}` });
});

router.post("/logout", (req, res) => {
  res.clearCookie("_Loya", {
    httpOnly: true,
    path: "/",
    domain: process.env.NODE_ENV === "production" ? "maplegremio.com" : "localhost",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  console.log("쿠키 삭제완료");
  res.status(200).send("Logged out");
});
module.exports = router;
