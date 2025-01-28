const { changeCurrentCharForKakaoService } = require("../service/changeCurrentCharForKakaoService");
const { kakaoSignIn } = require("../service/kakaoSignin");
const { refreshTokenService } = require("../service/refreshToken");
const { saveHandsImageForKakao } = require("../service/saveHandsImageForKakao");

const kakaoSignInController = async (req, res) => {
  try {
    const kakaoData = req.user;
    const result = await kakaoSignIn(kakaoData);
    if (result.message === "로컬 계정으로 로그인해주세요.") {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
    console.log(result);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const saveHandsImageController = async (req, res) => {
  const kakaoData = req.user;
  const { mainCharOcid, currentCharOcid } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: "이미지 파일이 없습니다." });
  }

  if (!mainCharOcid || !currentCharOcid) {
    return res.status(400).json({ message: "ocid가 없습니다." });
  }
  try {
    if (!kakaoData || !kakaoData.kakao_account) {
      return res.status(401).json({ message: "카카오 계정 정보가 없습니다." });
    }

    const result = await saveHandsImageForKakao(kakaoData.kakao_account.email, req.file, mainCharOcid, currentCharOcid);

    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json("이미 등록된 캐릭터입니다.");
    }

    res.status(500).json(error.message);
  }
};
const refreshTokenController = async (req, res) => {
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

    if (result.message === "리프레쉬 토큰이 만료되었습니다.") {
      return res.status(401).json({
        success: false,
        message: "리프레쉬 토큰이 만료되었습니다.",
      });
    }
    console.log(result, "result");

    res.status(200).json({ accessToken: result.accessToken });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "리프레쉬 토큰이 만료되었습니다.",
    });
  }
};

const checkLastCharChangeForKakaoController = async (req, res) => {
  const { email } = req.query;

  try {
    const result = await checkLastCharChangeService(email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(false);
  }
};

const changeCurrentCharForKakaoController = async (req, res) => {
  const { currentCharOcid } = req.body;

  console.log(currentCharOcid, "currentCharOcid");
  const user = req.user.kakao_account;

  console.log(user, "user");
  if (!currentCharOcid) {
    return res.status(400).json({ message: "캐릭터가 선택되지 않았습니다." });
  }

  try {
    const result = await changeCurrentCharForKakaoService(user, currentCharOcid);
    console.log(result, "result");
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

module.exports = {
  kakaoSignInController,
  saveHandsImageController,
  refreshTokenController,
  changeCurrentCharForKakaoController,
  checkLastCharChangeForKakaoController,
};
