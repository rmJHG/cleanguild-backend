const getOcid = async (character_name) => {
  const API_KEY = process.env.NEXON_API_KEY;

  try {
    const ocidResponse = await fetch(`https://open.api.nexon.com/maplestory/v1/id?character_name=${character_name}`, {
      method: "GET",
      headers: {
        "x-nxopen-api-key": API_KEY,
      },
    });

    if (!ocidResponse.ok) {
      throw new Error("ocid정보를 가져오는데 실패했습니다.");
    }

    const { ocid } = await ocidResponse.json();
    return ocid;
  } catch (error) {
    throw error;
  }
};

module.exports = { getOcid };
