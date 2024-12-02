const { getOcid } = require("./getOcid");

async function getCharData(character_name) {
  const API_KEY = process.env.NEXON_API_KEY;

  try {
    const ocid = await getOcid(character_name);
    const getCharData = await fetch(`https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}`, {
      headers: {
        "x-nxopen-api-key": API_KEY,
      },
    });
    if (!getCharData.ok) throw new Error("캐릭터 정보가 없습니다.");
    const charJson = await getCharData.json();
    return { ...charJson, ocid };
  } catch (error) {
    throw new Error("캐릭터 정보를 가져오는데 실패했습니다.");
  }
}

module.exports = { getCharData };
