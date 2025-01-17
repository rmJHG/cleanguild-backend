const bcrypt = require("bcrypt");
const User = require("../entity/User");

const changePasswordService = async (email, currentPassword, newPassword) => {
  console.log(email, currentPassword, newPassword);
  try {
    const user = await User.findOne({ email }).select("+password").exec();
    if (!user) {
      throw new Error("유저가 존재하지 않습니다.");
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    console.log(isPasswordMatch, "isPasswordMatch");
    console.log(user.password, "user.password");

    if (!isPasswordMatch) {
      throw new Error("현재 비밀번호가 일치하지 않습니다.");
    }
    if (currentPassword === newPassword) {
      throw new Error("현재 비밀번호를 새로운 비밀번호로 변경할 수 없습니다.");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { message: "비밀번호가 변경되었습니다." };
  } catch (error) {
    throw error;
  }
};

module.exports = { changePasswordService };
