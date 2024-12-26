const kakaoAuthenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "토큰이 없습니다." });
    }

    const kakaoCheck = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const kakaoData = await kakaoCheck.json();

    if (kakaoData.code === -401) {
      return res.status(401).json({ message: "토큰이 만료되었습니다." });
    }

    req.user = kakaoData;
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

module.exports = { kakaoAuthenticateToken };
