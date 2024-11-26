const { getOcid } = require("./getOcid");

async function getMainChar(character_name) {
  const API_KEY = process.env.NEXON_API_KEY;

  try {
    const dt = new Date();
    const hour = dt.getHours();
    const minutes = dt.getMinutes();

    // 현재 시간이 00:30 이전이면 하루 전 날짜 사용
    if (hour === 0 && minutes < 30) {
      dt.setDate(dt.getDate() - 1);
    }

    const currentDt = dt.toLocaleDateString("en-CA");

    const ocid = await getOcid(character_name);

    const getMainCharData = await fetch(
      `https://open.api.nexon.com/maplestory/v1/ranking/union?ocid=${ocid}&date=${currentDt}&page=1`,
      {
        method: "GET",
        headers: {
          "x-nxopen-api-key": API_KEY,
        },
      }
    );
    const mainCharJson = await getMainCharData.json();
    console.log(mainCharJson);

    return mainCharJson.ranking[0].character_name;
  } catch (error) {
    return null;
  }
}

module.exports = { getMainChar };
