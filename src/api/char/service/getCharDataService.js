const { getCharData } = require("../../../utils/getCharData");
const CharData = require("../entity/CharData");

const getCharDataService = async (charName) => {
  try {
    const charData = await CharData.findOne({ character_name: charName });

    if (!charData) {
      const searchedCharData = await getCharData(charName);
      const newCharData = new CharData({
        ...searchedCharData,
        lastUpdateDate: new Date().toISOString(),
      });
      await newCharData.save();
      return newCharData;
    }

    return charData;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getCharDataService,
};
