const User = require("../entity/User");
const bcrypt = require("bcrypt");

const signUp = async (email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role: "user" });
    await user.save();
    return { message: "회원가입이 완료되었습니다." };
  } catch (error) {
    throw new Error("회원가입 중 오류가 발생했습니다.");
  }
};

module.exports = { signUp };
