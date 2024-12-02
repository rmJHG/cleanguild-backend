const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const sendVerificationLink = async (email) => {
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  if (!email || !isValidEmail(email)) {
    return {
      success: false,
      message: "유효하지 않은 이메일 주소입니다.",
      error: "INVALID_EMAIL",
    };
  }
  const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const verificationLink = `${process.env.FRONTEND_URL}/verifyEmail?welcome=${verificationToken}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "CLEAN GUILD 인증 코드 발송",
    html: `
       <div style="text-align: center;">
      <h1>CLEAN GUILD 이메일 인증</h1>
      <p>아래 링크를 클릭하여 이메일 인증을 완료해주세요</p>
      <a href="${verificationLink}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #ffffff; border: 2px solid #000000; text-decoration: none; color: #000000; margin: 20px 0;">이메일 인증하기</a>

      <p>이 링크는 1시간 동안만 유효합니다.</p>
    </div>
  `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`${email}로 이메일 전송 완료: ${info.response}`);
    return { success: true, message: "이메일이 성공적으로 전송되었습니다." };
  } catch (error) {
    console.error("이메일 전송 실패:", error);
    return {
      success: false,
      message: "이메일 전송에 실패했습니다.",
      error: error.message,
    };
  }
};

module.exports = { sendVerificationLink };
