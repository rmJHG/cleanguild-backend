const { getOcid } = require("./getOcid");

async function getCharData(character_name) {
  const API_KEY = process.env.NEXON_API_KEY;

  try {
    const ocid = await getOcid(character_name);
    console.log(character_name, "character_name");
    console.log(ocid, "ocid");
    let now = new Date();

    if (process.env.NODE_ENV === "development") {
      now = new Date(now.getTime());
    } else {
      now = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    }

    const kstHours = now.getHours();

    let dateParam = "";
    if (kstHours >= 0 && kstHours < 2) {
      now.setDate(now.getDate() - 1);
      const date = now.toISOString().split("T")[0];
      dateParam = `&date=${date}`;
    }

    const getCharData = await fetch(`https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}${dateParam}`, {
      headers: {
        "x-nxopen-api-key": API_KEY,
      },
    });
    const charJson = await getCharData.json();
    console.log(charJson, "charJson");

    if (!getCharData.ok) throw new Error(`${character_name}의 캐릭터 정보가 없습니다.`);

    const getCharPopData = await fetch(`https://open.api.nexon.com/maplestory/v1/character/popularity?ocid=${ocid}${dateParam}`, {
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

module.exports = { getCharData };
