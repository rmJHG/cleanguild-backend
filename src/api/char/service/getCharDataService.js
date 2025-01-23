const { getCharData } = require("../../../utils/getCharData");
const CharData = require("../entity/CharData");

const getCharDataService = async (charNames) => {
  try {
    const charDataList = [];

    for (const charName of charNames) {
      try {
        let charData = await CharData.findOne({ character_name: charName });
        const now = new Date();

        if (!charData) {
          const searchedCharData = await getCharData(charName);
          const newCharData = new CharData({
            ...searchedCharData,
            lastUpdateDate: now.toISOString(),
          });
          await newCharData.save();
          charData = newCharData;
        } else {
          const lastUpdateDate = new Date(charData.lastUpdateDate);
          if (now - lastUpdateDate > 1000 * 60 * 60 * 24 * 7) {
            console.log(`캐릭터 정보를 업데이트합니다. ${charName}`);
            const updatedCharData = await getCharData(charName);
            charData = Object.assign(charData, {
              ...updatedCharData,
              lastUpdateDate: now.toISOString(),
            });
            await charData.save();
          }
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
