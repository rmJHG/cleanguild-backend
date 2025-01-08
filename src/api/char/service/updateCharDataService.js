const { getCharData } = require("../../../utils/getCharData");
const CharData = require("../entity/CharData");

const updateCharDataService = async (charName) => {
  try {
    const newCharData = getCharData(charName);

    const updatedCharData = await CharData.findOneAndUpdate(
      { character_name: charName },
      {
        $set: {
          ...newCharData,
          lastUpdateDate: new Date().toISOString(),
        },
      },
      { new: true }
    );
    return updatedCharData;
  } catch (error) {
    return error;
  }
};

module.exports = {
  updateCharDataService,
};
