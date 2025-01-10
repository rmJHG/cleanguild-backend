const { getCharData } = require("../../../utils/getCharData");
const CharData = require("../entity/CharData");

const getCharDataService = async (charNames) => {
  try {
    const charDataList = [];

    for (const charName of charNames) {
      try {
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

        if (charData) {
          charDataList.push(charData);
        }
      } catch (error) {
        console.error(`캐릭터 정보를 가져오는데 실패했습니다. ${charName}:`, error);
        continue;
      }
    }

    return charDataList.sort((a, b) => b.character_level - a.character_level);
  } catch (error) {
    return error;
  }
};

module.exports = {
  getCharDataService,
};
