const { getCharData } = require("../../../utils/getCharData");
const { getMainChar } = require("../../../utils/getMainChar");

const getSubCharDataService = async (inputMainCharName, subCharName) => {
  try {
    const searchResultName = await getMainChar(subCharName);

    if (searchResultName === inputMainCharName) {
      const charData = await getCharData(subCharName);
      return charData;
    } else {
      throw new Error("해당 캐릭터는 메인 캐릭터의 서브 캐릭터가 아닙니다.");
    }
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getSubCharDataService,
};
