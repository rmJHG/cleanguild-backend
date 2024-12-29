const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token) {
      return res.status(401).json({ message: "토큰이 없습니다." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        // 에러 타입에 따른 구체적인 메시지 처리
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "토큰이 만료되었습니다." });
        } else if (err.name === "JsonWebTokenError") {
          return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
        }
        return res.status(401).json({ message: "토큰 인증에 실패했습니다." });
      }

      req.user = user; // 다음 미들웨어에서 사용할 수 있도록
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

module.exports = { authenticateToken };
