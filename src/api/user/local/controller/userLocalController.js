const { signUp } = require("../service/signUp");
const { signIn } = require("../service/signIn");
const { saveHandsImage } = require("../service/saveHandsImage");
const { sendVerificationLink } = require("../service/sendVerificationCode");
const { refreshTokenService } = require("../service/refreshToken");
const User = require("../entity/User");
const jwt = require("jsonwebtoken");
const KakaoUser = require("../../kakao/entity/KakaoUser");
const { changePasswordService } = require("../service/changePasswordService");
const { findUserEmailService } = require("../service/findUserEmailService");
const { resetUserPasswordService } = require("../service/resetUserPasswordService");
const { changeCurrentCharService } = require("../service/changeCurrentCharService");

const resendEmailVerificationCodeController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "이메일이 입력되지 않았습니다." });
    return;
  }
  try {
    const result = await sendVerificationLink(email);
    console.log(result, "result");
    res.status(200).json({ result: result.message });
  } catch (error) {
    res.status(500).json({ message: "인증 코드 발송 중 오류가 발생했습니다." });
  }
};
const checkEmailController = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    return;
  }

  const result = await sendVerificationLink(email);
  console.log(result, "result");
  result ? res.status(200).json({ message: "인증 코드가 발송되었습니다." }) : res.status(500).json({ message: "인증 코드 발송 중 오류가 발생했습니다." });
};
const verifyEmailController = async (req, res) => {
  const { welcome } = req.query;

  console.log(welcome, "welcome");
  try {
    const decoded = jwt.verify(welcome, process.env.JWT_SECRET);
    console.log(decoded, "decoded");
    if (!decoded) return res.status(400).json({ message: "유효하지 않은 토큰입니다." });

    const email = decoded.email;
    const user = await User.findOne({ email });
    if (user) {
      if (user.isVerified) return res.status(200).json({ message: "이미 인증된 이메일입니다." });

      user.isVerified = true;
      await user.save();

      const accessToken = jwt.sign({ userId: user._id, email: user.email, role: user.role, ...(user.ocid && { ocid: user.ocid }) }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "이메일 인증이 완료되었습니다.", accessToken });
    } else {
      res.status(404).json({ message: "유저를 찾을 수 없습니다.", email });
    }
  } catch (error) {
    let email = null;
    console.log(error.message, "error");
    if (error.message === "jwt malformed") {
      return res.status(400).json({ message: "유효하지 않은 토큰입니다.", email });
    }

    // 만료된 토큰에서 이메일 추출
    try {
      const decoded = jwt.decode(welcome);
      email = decoded?.email || null; // 이메일이 없으면 null
    } catch (decodeError) {
      console.error("토큰 디코딩 중 오류:", decodeError);
    }

    if (error.message === "jwt expired") {
      return res.status(401).json({
        message: "이메일 인증 토큰이 만료됐습니다.",
        email, // 이메일 포함
      });
    }

    return res.status(500).json({
      message: "이메일 인증 중 오류가 발생했습니다.",
      email, // 이메일 포함
    });
  }
};
const signUpController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "이메일 또는 비밀번호가 입력되지 않았습니다." });
    return;
  }
  if (await User.findOne({ email })) {
    res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    return;
  }
  if (await KakaoUser.findOne({ email })) {
    res.status(409).json({ message: "이미 카카오로 가입한 이메일입니다." });
    return;
  }
  try {
    const result = await signUp(email, password);
    if (result.message === "회원가입이 완료되었습니다.") {
      const sendEmail = await sendVerificationLink(email);
      sendEmail ? res.status(200).json({ result }) : res.status(500).json({ message: "인증 코드 발송 중 오류가 발생했습니다." });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: "회원가입 중 오류가 발생했습니다.",
    });
  }
};

const signInController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "이메일 또는 비밀번호가 입력되지 않았습니다." });
    return;
  }

  try {
    const result = await signIn(email, password);
    console.log(result, "result");
    res
      .status(200)
      .setHeader("Access-Control-Allow-Credentials", "true")
      .cookie("_Loya", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
        path: "/",
      })
      .json({
        message: result.message,
        profile: {
          email: result.email,
          accessToken: result.accessToken,
          mainCharOcid: result.mainCharOcid,
          currentCharOcid: result.currentCharOcid,
          isVerified: result.isVerified,
          loginType: result.loginType,
        },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      email,
      error: "로그인 중 오류가 발생했습니다.",
    });
  }
};

const saveHandsImageController = async (req, res) => {
  const user = req.user;
  const { mainCharOcid, currentCharOcid } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: "이미지 파일이 없습니다." });
  }

  if (!mainCharOcid || !currentCharOcid) {
    return res.status(400).json({ message: "ocid가 없습니다." });
  }
  try {
    const result = await saveHandsImage(user, req.file, mainCharOcid, currentCharOcid);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    if (error.code === 409) {
      return res.status(409).json("이미 등록된 캐릭터입니다.");
    }

    res.status(500).json(error.message);
  }
};

const refreshTokenController = async (req, res) => {
  // console.log(req.cookies._Loya, "cookie");
  const refreshToken = req.cookies._Loya;
  console.log(refreshToken, "refreshToken");
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "리프레시 토큰이 없습니다. 다시 로그인해주세요.",
    });
  }
  try {
    const result = await refreshTokenService(refreshToken);
    console.log(result);
    if (result.message === "리프레쉬 토큰이 만료되었습니다.") {
      return res.status(401).json({
        success: false,
        message: "리프레쉬 토큰이 만료되었습니다.",
      });
    }
    res.status(200).json({ accessToken: result.accessToken });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "리프레쉬 토큰이 만료되었습니다.",
    });
  }
};
const changePasswordController = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  console.log(email, currentPassword, newPassword);
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "이메일 또는 비밀번호가 입력되지 않았습니다." });
  }

  try {
    const result = await changePasswordService(email, currentPassword, newPassword);
    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.log(error, "error");
    if (error.message === "현재 비밀번호가 일치하지 않습니다.") {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === "현재 비밀번호를 새로운 비밀번호로 변경할 수 없습니다.") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message,
      error: "비밀번호 변경 중 오류가 발생했습니다.",
    });
  }
};
const getUserEmailController = async (req, res) => {
  const { charName } = req.query;
  if (!charName) {
    return res.status(400).json({ message: "캐릭터 이름이 입력되지 않았습니다" });
  }
  try {
    const result = await findUserEmailService(charName);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "이메일 찾기 중 오류가 발생했습니다." });
  }
};

const resetUserPasswordController = async (req, res) => {
  const { email, charName } = req.body;
  console.log(email, charName);
  if (!email || !charName) {
    return res.status(400).json({ message: "이메일 또는 캐릭터 이름이 입력되지 않았습니다." });
  }
  try {
    const result = await resetUserPasswordService(email, charName);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "비밀번호 초기화 중 오류가 발생했습니다." });
  }
};
const changeCurrentCharController = async (req, res) => {
  const { currentCharOcid } = req.body;
  const user = req.user;
  if (!currentCharOcid) {
    return res.status(400).json({ message: "캐릭터가 선택되지 않았습니다." });
  }
  try {
    const result = await changeCurrentCharService(user, currentCharOcid);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "캐릭터 변경 중 오류가 발생했습니다." });
  }
};
module.exports = {
  checkEmailController,
  verifyEmailController,
  signUpController,
  signInController,
  saveHandsImageController,
  refreshTokenController,
  resendEmailVerificationCodeController,
  changePasswordController,
  getUserEmailController,
  resetUserPasswordController,
  changeCurrentCharController,
};
