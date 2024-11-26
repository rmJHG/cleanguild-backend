function findDuplicate(arr) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return duplicates.size > 0 ? Array.from(duplicates) : arr;
}

module.exports = { findDuplicate };
