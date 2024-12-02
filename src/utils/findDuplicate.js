function findDuplicate(arr) {
  const seen = new Set();
  const duplicates = new Set();

  // falsy가 아닌 문자열만 필터링
  const validItems = arr.filter((item) => item && typeof item === "string");

  for (const item of validItems) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  // 중복이 없으면 원래 배열의 유효한 항목들 반환
  return duplicates.size > 0 ? Array.from(duplicates) : validItems;
}
module.exports = { findDuplicate };
