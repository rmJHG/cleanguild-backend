const { kakaoSignIn } = require("../service/kakaoSignin");
const { saveHandsImageForKakao } = require("../service/saveHandsImageForKakao");

const kakaoSignInController = async (req, res) => {
  const kakaoData = res.user;
  const result = await kakaoSignIn(kakaoData);
  res.json({ result });
};

const saveHandsImageController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "이미지 파일이 없습니다." });

    if (!req.body.ocid) return res.status(400).json({ message: "ocid가 없습니다." });
    if (!res.user || !res.user.kakao_account) {
      return res.status(401).json({ message: "카카오 계정 정보가 없습니다." });
    }
    console.log(req.file.buffer);
    const result = await saveHandsImageForKakao(res.user.kakao_account.email, req.file.buffer, req.body.ocid);

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

module.exports = {
  kakaoSignInController,
  saveHandsImageController,
};
