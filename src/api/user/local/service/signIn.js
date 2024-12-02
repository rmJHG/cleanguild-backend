const User = require("../entity/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const buffer = require("buffer");

const signIn = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("존재하지 않는 이메일입니다.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, ...(user.ocid && { ocid: user.ocid }) },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    let refreshToken = user.refreshToken;
    let needsNewRefreshToken = false;
    let message = "로그인이 완료되었습니다.";
    // 리프레시 토큰 검증 또는 새로 발급
    if (refreshToken) {
      try {
        jwt.verify(refreshToken, process.env.JWT_SECRET);
      } catch (error) {
        needsNewRefreshToken = true;
      }
    } else {
      needsNewRefreshToken = true;
    }

    // 필요한 경우에만 새로운 리프레시 토큰 발급
    if (needsNewRefreshToken) {
      refreshToken = jwt.sign(
        { userId: user._id, email: user.email, role: user.role, ...(user.ocid && { ocid: user.ocid }) },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      await User.findOneAndUpdate({ email }, { refreshToken });
      message = "새로운 리프레시 토큰이 발급되었습니다.";
    }

    let handsImageBase64 = null;
    if (user.handsImage) {
      try {
        const handsImage = await sharp(Buffer.from(user.handsImage))
          .jpeg({
            quality: 100,
            progressive: true,
          })
          .toBuffer();
        handsImageBase64 = `data:image/jpeg;base64,${handsImage.toString("base64")}`;
      } catch (imageError) {
        console.error("이미지 처리 중 오류:", imageError);
        // 이미지 처리 실패시에도 로그인은 계속 진행
      }
    }
    return {
      message,
      email: user.email,
      accessToken,
      refreshToken,
      ocid: user.ocid,
      isVerified: user.isVerified,
      handsImage: handsImageBase64,
    };
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "로그인 중 오류가 발생했습니다.");
  }
};

module.exports = { signIn };
