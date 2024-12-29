const { getGuildModel } = require("../entity/GuildPost");

const getGuildRecruitments = async (world_name) => {
  try {
    const currentGuildModel = getGuildModel(world_name);
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    console.log(currentGuildModel);
    const recruitments = await currentGuildModel.find({
      "postData.postDate": {
        $gte: oneWeekAgo,
      },
    }); // 컬렉션의 모든 데이터 가져오기

    console.log(recruitments);
    return recruitments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { getGuildRecruitments };
