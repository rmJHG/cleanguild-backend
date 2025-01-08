const { getCharDataService } = require("../service/getCharDataService");
const { updateCharDataService } = require("../service/updateCharDataService");

const getCharDataController = async (req, res) => {
  const { charName } = req.query;

  if (!charName) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });

  try {
    const charData = await getCharDataService(charName);
    return res.status(200).json(charData);
  } catch (error) {
    return res.status(500).json({ message: "캐릭터 데이터를 가져오는데 실패했습니다.", error });
  }
};

const updateCharDataController = async (req, res) => {
  const { charName } = req.body;

  if (!charName) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });

  try {
    const charData = await updateCharDataService(charName);
    return res.status(200).json(charData);
  } catch (error) {
    return res.status(500).json({ message: "캐릭터 데이터를 가져오는데 실패했습니다.", error });
  }
};
module.exports = {
  getCharDataController,
  updateCharDataController,
};
