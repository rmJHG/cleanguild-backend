const { getCharData } = require("../../../utils/getCharData");
const CharData = require("../entity/CharData");

const getCharDataService = async (charNames) => {
  try {
    const charDataList = [];

    for (const charName of charNames) {
      let charData = await CharData.findOne({ character_name: charName });

      if (!charData) {
        const searchedCharData = await getCharData(charName);
        const newCharData = new CharData({
          ...searchedCharData,
          lastUpdateDate: new Date().toISOString(),
        });
        await newCharData.save();
        charData = newCharData;
      }

      charDataList.push(charData);
    }

    return charDataList.sort((a, b) => b.character_level - a.character_level);
  } catch (error) {
    return error;
  }
};

module.exports = {
  getCharDataService,
};
