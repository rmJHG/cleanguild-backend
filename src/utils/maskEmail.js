function maskEmail(email) {
  const emailParts = email.split("@");
  const localPart = emailParts[0];

  if (localPart.length <= 7) {
    emailParts[0] = localPart
      .split("")
      .map((char, index) => {
        return index === 2 || index === 3 || index === 4 ? "*" : char;
      })
      .join("");
  } else {
    emailParts[0] = localPart
      .split("")
      .map((char, index) => {
        return index === 2 || index === 3 || index === 4 || index === 5 ? "*" : char;
      })
      .join("");
  }

  return emailParts.join("@");
}

module.exports = {
  maskEmail,
};
