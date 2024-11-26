const { signUp } = require("../service/signUp");
const { signIn } = require("../service/signIn");
const { saveHandsImage } = require("../service/saveHandsImage");
const User = require("../entity/User");
const jwt = require("jsonwebtoken");

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

  try {
    const result = await signUp(email, password);
    res.json({ result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: "로그인 중 오류가 발생했습니다.",
    });
  }
};

const signInController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "이메일 또는 비밀번호가 입력되지 않았습니다." });
    return;
  }
  if (!(await User.findOne({ email }))) {
    res.status(409).json({ message: "유저가 존재하지 않습니다." });
    return;
  }
  try {
    const result = await signIn(email, password);

    res.cookie("refreshToken", result.refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ message: result.message, accessToken: result.accessToken, handsImage: result.handsImage });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: "로그인 중 오류가 발생했습니다.",
    });
  }
};

const saveHandsImageController = async (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "인증 토큰이 필요합니다." });
  }
  if (!req.file) {
    return res.status(400).json({ message: "이미지 파일이 없습니다." });
  }
  const result = await saveHandsImage(accessToken, req.file);

  console.log(result);
  res.json({ result });
};

const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const result = await refreshTokenService(refreshToken);
  res.status(200).json({ accessToken: result.accessToken });
};
module.exports = { signUpController, signInController, saveHandsImageController, refreshTokenController };
