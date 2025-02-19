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

const {
  searchCharDataController,
  updateCharDataController,
  getSubCharDataController,
  getMainCharDataController,
  verifyUserMainCharController,
} = require("../api/char/controller/charDataController");

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
router.post("/user/local/resendEmailVerificationCode", userLocalController.resendEmailVerificationCodeController);
router.post("/user/local/signup", userLocalController.signUpController);
router.post("/user/local/signin", userLocalController.signInController);
router.post("/user/local/saveHandsImage", authenticateToken, upload.single("image"), userLocalController.saveHandsImageController);
router.post("/user/local/refreshToken", userLocalController.refreshTokenController);
router.patch("/user/local/changePassword", checkLoginType, userLocalController.changePasswordController);
router.get("/user/local/findUserEmail", userLocalController.getUserEmailController);
router.post("/user/local/resetUserPassword", userLocalController.resetUserPasswordController);
router.patch("/user/local/changeCurrentChar", checkLoginType, userLocalController.changeCurrentCharController);
router.get("/user/local/checkLastCharChange", checkLoginType, userLocalController.checkLastCharChangeController);
router.post("/user/local/deleteUser", checkLoginType, userLocalController.deleteUserController);
router.post("/user/local/cancelDeleteUser", userLocalController.cancelDeleteUserController);

//카카오 로그인
router.post("/user/kakao/signIn", kakaoAuthenticateToken, userKakaoController.kakaoSignInController);
router.post("/user/kakao/saveHandsImage", kakaoAuthenticateToken, upload.single("image"), userKakaoController.saveHandsImageController);
router.post("/user/kakao/refreshToken", userKakaoController.refreshTokenController);
router.patch("/user/kakao/changeCurrentChar", kakaoAuthenticateToken, userKakaoController.changeCurrentCharForKakaoController);
router.get("/user/kakao/checkLastCharChange", kakaoAuthenticateToken, userKakaoController.checkLastCharChangeForKakaoController);
router.post("/user/kakao/deleteUser", checkLoginType, userKakaoController.deleteUserForKakaoController);
router.post("/user/kakao/cancelDeleteUser", userKakaoController.cancelDeleteUserForKakaoController);

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

//캐릭터 api
router.post("/char/searchCharData", searchCharDataController);
router.put("/char/updateCharData", updateCharDataController);
router.get("/char/getSubCharData", getSubCharDataController);
router.get("/char/getMainCharData", getMainCharDataController);
router.post("/char/verifyUserMainChar", verifyUserMainCharController);

//테스트 api
router.post("/upload", upload.single("image"), async (req, res) => {
  console.log(req.file);

  const save = await saveImageFile(req.file);
  res.json({ url: `/uploads/post/${save.filename}` });
});
// router.post("/test", async (req, res) => {
//   const email = {
//     from: {
//       name: "My awesome startup",
//       email: "service@maplegremio.com",
//     },
//     recipients: [
//       {
//         name: "Someone",
//         email: "jdfsfhg990508@gmail.com",
//       },
//     ],
//     content: {
//       subject: "Sample email",
//       text_body: "Plain text body",
//       html_body: "<p>This is the <b>HTML</b> body</p>",
//     },
//   };
//   const response = await fetch("https://api.ahasend.com/v1/email/send", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-Api-Key": "Y6Dsy9OEjM4eb41D2eOwMx4LQKtSOPgf4fhQSt1DFeVMi9PKAYGT3hQl6E51HItR",
//     },
//     body: JSON.stringify(email),
//   });
//   const data = await response.json();
//   console.log(data);
// });
module.exports = router;
