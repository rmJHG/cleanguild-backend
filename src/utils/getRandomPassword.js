const getRandomPassword = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const chars = letters + numbers;
  const passwordLength = 12;

  let password = "";

  // 최소 1개의 소문자와 숫자를 추가
  password += letters.charAt(Math.floor(Math.random() * letters.length)); // 소문자
  password += numbers.charAt(Math.floor(Math.random() * numbers.length)); // 숫자

  // 나머지 자리수는 랜덤으로 채우기
  for (let i = 2; i < passwordLength; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // 비밀번호를 랜덤하게 섞기
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
};
module.exports = { getRandomPassword };
