const { signUp } = require("../service/signUp");
const { signIn } = require("../service/signIn");
const { saveHandsImage } = require("../service/saveHandsImage");
const { sendVerificationLink } = require("../service/sendVerificationCode");
const { refreshTokenService } = require("../service/refreshToken");
const User = require("../entity/User");
const jwt = require("jsonwebtoken");

const resentEmailVerificationCodeController = async (req, res) => {
  const { email } = req.body;
  console.log(email, "email");
  const result = await sendVerificationLink(email);
  result
    ? res.status(200).json({ result: result.message })
    : res.status(500).json({ message: "인증 코드 발송 중 오류가 발생했습니다." });
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
  result
    ? res.status(200).json({ message: "인증 코드가 발송되었습니다." })
    : res.status(500).json({ message: "인증 코드 발송 중 오류가 발생했습니다." });
};
const verifyEmailController = async (req, res) => {
  const { welcome } = req.query;
  console.log(welcome);

  try {
    const decoded = jwt.verify(welcome, process.env.JWT_SECRET);
    if (!decoded) return res.status(400).json({ message: "유효하지 않은 토큰입니다." });

    const email = decoded.email;
    const user = await User.findOne({ email });
    if (user) {
      if (user.isVerified) return res.status(200).json({ message: "이미 인증된 이메일입니다." });

      user.isVerified = true;
      await user.save();
      res.status(200).json({ message: "이메일 인증이 완료되었습니다." });
    } else {
      res.status(404).json({ message: "유저를 찾을 수 없습니다.", email });
    }
  } catch (error) {
    let email = null;

    // 만료된 토큰에서 이메일 추출
    try {
      const decoded = jwt.decode(welcome);
      email = decoded?.email || null; // 이메일이 없으면 null
    } catch (decodeError) {
      console.error("토큰 디코딩 중 오류:", decodeError);
    }

    if (error.name === "TokenExpiredError") {
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

  try {
    const result = await signUp(email, password);
    if (result.message === "회원가입이 완료되었습니다.") {
      const sendEmail = await sendVerificationLink(email);
      sendEmail
        ? res.status(200).json({ result })
        : res.status(500).json({ message: "인증 코드 발송 중 오류가 발생했습니다." });
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
  if (!(await User.findOne({ email }))) {
    res.status(409).json({ message: "유저가 존재하지 않습니다." });
    return;
  }
  try {
    const result = await signIn(email, password);

    res
      .status(200)
      .setHeader("Access-Control-Allow-Credentials", "true")
      .cookie("_Loya", result.refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
        path: "/",
      })
      .json({
        message: result.message,
        profile: {
          email: result.email,
          accessToken: result.accessToken,
          ocid: result.ocid,
          handsImage: result.handsImage,
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
  if (!req.file) {
    return res.status(400).json({ message: "이미지 파일이 없습니다." });
  }

  if (!req.body.ocid) {
    return res.status(400).json({ message: "ocid가 없습니다." });
  }
  try {
    const result = await saveHandsImage(user, req.file.buffer, req.body.ocid);

    console.log(result);
    res.json({ result });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "이미 등록된 캐릭터입니다.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
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
    res.status(200).json({ accessToken: result.accessToken });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "리프레시 토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.",
    });
  }
};

module.exports = {
  checkEmailController,
  verifyEmailController,
  signUpController,
  signInController,
  saveHandsImageController,
  refreshTokenController,
  resentEmailVerificationCodeController,
};
