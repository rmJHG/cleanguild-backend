const { allImages } = require("../constants/constants");

function getRandomImages(count) {
  const selected = new Set();
  while (selected.size < count) {
    const randomIndex = Math.floor(Math.random() * allImages.length);
    selected.add(allImages[randomIndex]);
  }
  return Array.from(selected);
}

module.exports = { getRandomImages };
