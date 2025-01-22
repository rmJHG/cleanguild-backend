const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const { getOcid } = require("../../../../utils/getOcid");
const User = require("../entity/User");
const { getRandomPassword } = require("../../../../utils/getRandomPassword");

const resetUserPasswordService = async (email, charName) => {
  try {
    const ocid = await getOcid(charName);
    const userByChar = await User.findOne({
      $or: [{ mainCharOcid: ocid }, { currentCharOcid: ocid }],
    });
    const userByEmail = await User.findOne({ email });
    if (!userByChar || !userByEmail) {
      throw new Error("입력한 정보와 일치하는 유저를 찾을 수 없습니다.");
    }
    if (userByChar.email !== userByEmail.email) {
      throw new Error("이메일 또는 캐릭터 이름이 유저 정보와 일치하지 않습니다.");
    }
    const newPassword = getRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("ID:", process.env.AHASEND_ID);
    console.log("Password:", process.env.AHASEND_PASSWORD);
    console.log("Host:", process.env.AHASEND_HOST);
    console.log("Port:", process.env.AHASEND_PORT);

    const transporter = nodemailer.createTransport({
      host: process.env.AHASEND_HOST,
      port: parseInt(process.env.AHASEND_PORT, 10),

      auth: {
        user: process.env.AHASEND_ID,
        pass: process.env.AHASEND_PASSWORD,
      },
    });

    const mailOptions = {
      from: `MAPLEGREMIO <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: "MAPLEGREMIO 비밀번호 찾기",
      html: `
           <div style="text-align: center;">
          <h1>MAPLEGREMIO</h1>
          <p>${email} 님의 임시 비밀번호 입니다. 로그인을 완료한 뒤 비밀번호를 변경해주세요.</p>
          <div style="display: inline-block; padding: 10px 20px; background-color: #ffffff; border: 1px solid #000000;border-radius:5px; text-decoration: none; color: #000000; margin: 20px 0;">
            <p>임시 비밀번호: ${newPassword}</p>
          </div>
    
       
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    console.log(`${email}로 이메일 전송 완료: ${info.response}`);

    return "임의의 비밀번호로 초기화되었습니다. 이메일을 확인해주세요.";
  } catch (error) {
    throw error;
  }
};

module.exports = { resetUserPasswordService };
