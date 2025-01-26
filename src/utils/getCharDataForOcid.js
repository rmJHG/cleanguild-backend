async function getCharDataForOcid(ocid) {
  const API_KEY = process.env.NEXON_API_KEY;

  try {
    const getCharData = await fetch(`https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}`, {
      headers: {
        "x-nxopen-api-key": API_KEY,
      },
    });
    if (!getCharData.ok) throw new Error(`${character_name}의 캐릭터 정보가 없습니다.`);
    const charJson = await getCharData.json();
    const getCharPopData = await fetch(`https://open.api.nexon.com/maplestory/v1/character/popularity?ocid=${ocid}`, {
      headers: {
        "x-nxopen-api-key": API_KEY,
      },
    });

    const popularity = await getCharPopData.json();

    return { ...charJson, ocid, popularity: popularity.popularity };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { getCharDataForOcid };
