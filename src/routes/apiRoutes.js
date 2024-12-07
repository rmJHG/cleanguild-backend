const express = require("express");
const { upload } = require("../middlewares/multer");
const router = express.Router();
//미들웨어
const { kakaoAuthenticateToken } = require("../middlewares/kakaoAuthenticateToken");
const { authenticateToken } = require("../middlewares/authenticateToken");
//컨트롤러
const imageController = require("../api/handsData/image/controller/imageController");
const userLocalController = require("../api/user/local/controller/userLocalController");
const userKakaoController = require("../api/user/kakao/controller/userKakaoController");
const guildController = require("../api/guild/controller/guildController");

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

//이미지 api
router.post("/handsData/image/compare", upload.single("image"), imageController.compareImage);
router.post("/handsData/image/findMainCharacter", upload.single("image"), imageController.findMainCharacter);

//홍보게시글 api
router.post("/guild/local/postGuildRecruitments", authenticateToken, guildController.postGuildRecruitmentsController);
router.post(
  "/guild/kakao/postGuildRecruitments",
  kakaoAuthenticateToken,
  guildController.postGuildRecruitmentsController
);
router.post("/guild/getGuildRecruitments", guildController.getGuildRecruitmentsController);
router.post("/guild/getGuildRecruitmentPoster", guildController.getGuildRecruitmentPosterController);
router.post("/guild/getGuildRecruitmentPosterCooltime", guildController.getGuildRecruitmentPosterCooltimeController);

router.get("/test", (req, res) => {
  console.log(req.cookies, "cookie");

  if (req.cookies.refreshToken) {
    res.status(200).json({ message: "토큰왔음" });
  } else {
    res.status(401).json({ message: "토큰없음" });
  }
});
module.exports = router;
