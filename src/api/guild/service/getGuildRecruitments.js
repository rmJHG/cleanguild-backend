const { getGuildModel } = require("../entity/GuildPost");

const getGuildRecruitments = async (world_name) => {
  try {
    const currentGuildModel = getGuildModel(world_name);
    const recruitments = await currentGuildModel.find(); // 컬렉션의 모든 데이터 가져오기

    return recruitments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { getGuildRecruitments };
