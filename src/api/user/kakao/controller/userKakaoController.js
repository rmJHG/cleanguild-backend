const KakaoUser = require("../entity/KakaoUser");
const { changeCurrentCharForKakaoService } = require("../service/changeCurrentCharForKakaoService");
const { checkLastCharChangeForKakaoService } = require("../service/checkLastCharChangeService");
const { kakaoSignIn } = require("../service/kakaoSignin");
const { refreshTokenService } = require("../service/refreshToken");
const { saveHandsImageForKakao } = require("../service/saveHandsImageForKakao");

const kakaoSignInController = async (req, res) => {
  try {
    const kakaoData = req.user;
    const result = await kakaoSignIn(kakaoData);

    console.log(result, "result");
    res.status(200).json({ result });
  } catch (error) {
    if (error.message === "로컬 계정이 존재합니다. 일반로그인으로 로그인해주세요.") {
      return res.status(400).json(error.message);
    }
    if (error.message === "탈퇴 요청을 한 계정입니다.") {
      return res.status(400).json(error.message);
    }
    res.status(500).json(error.message);
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
    const result = await checkLastCharChangeForKakaoService(email);
    return res.status(200).json({ hasChangedIn7Days: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
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
const deleteUserForKakaoController = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "유저 정보 입력이 올바르지 않습니다." });
  }
  try {
    const user = await KakaoUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "존재하지 않는 이메일입니다." });
    }

    user.deleteRequestAt = new Date();
    await user.save();
    return res.status(200).json({ message: "탈퇴 요청 성공" });
  } catch (error) {
    return res.status(500).json({ message: "탈퇴 요청중 오류가 발생했습니다." });
  }
};
const cancelDeleteUserForKakaoController = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  if (!email) {
    return res.status(400).json({ message: "유저 정보 입력이 올바르지 않습니다." });
  }
  try {
    const user = await KakaoUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "존재하지 않는 이메일입니다." });
    }

    user.deleteRequestAt = null;
    await user.save();
    return res.status(200).json({ message: "탈퇴 취소 요청 성공" });
  } catch (error) {
    return res.status(500).json({ message: "탈퇴 요청중 오류가 발생했습니다." });
  }
};

module.exports = {
  kakaoSignInController,
  saveHandsImageController,
  refreshTokenController,
  changeCurrentCharForKakaoController,
  checkLastCharChangeForKakaoController,
  deleteUserForKakaoController,
  cancelDeleteUserForKakaoController,
};
