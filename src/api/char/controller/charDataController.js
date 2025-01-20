const { getCharDataService } = require("../service/getCharDataService");
const { getSubCharDataService } = require("../service/getSubCharDataService");
const { updateCharDataService } = require("../service/updateCharDataService");

const searchCharDataController = async (req, res) => {
  const { charNames } = req.body;

  if (!charNames) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });

  try {
    const charData = await getCharDataService(charNames);
    console.log(`${charNames} 데이터를 가져왔습니다.`);
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

const getSubCharDataController = async (req, res) => {
  const { mainCharName, subCharName } = req.query;

  console.log(mainCharName, subCharName);
  if (!mainCharName | !subCharName) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });

  try {
    const charData = await getSubCharDataService(mainCharName, subCharName);
    return res.status(200).json(charData);
  } catch (error) {
    console.log(error);
    if (error.message === "해당 캐릭터는 메인 캐릭터의 서브 캐릭터가 아닙니다.") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  searchCharDataController,
  updateCharDataController,
  getSubCharDataController,
};
