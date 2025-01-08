const { getCharData } = require("../../../utils/getCharData");
const CharData = require("../entity/CharData");

const getCharDataService = async (charNames) => {
  console.log(charNames, "charNames");
  try {
    const charDataList = [];

    for (const charName of charNames) {
      let charData = await CharData.findOne({ character_name: charName });
      console.log(charName, "charName");
      if (!charData) {
        const searchedCharData = await getCharData(charName);
        const newCharData = new CharData({
          ...searchedCharData,
          lastUpdateDate: new Date().toISOString(),
        });
        await newCharData.save();
        charData = newCharData;
      }

      console.log(charData);
      charDataList.push(charData);
    }

    return charDataList;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getCharDataService,
};
