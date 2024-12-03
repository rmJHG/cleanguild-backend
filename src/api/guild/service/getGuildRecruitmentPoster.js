const { getGuildModel } = require("../entity/GuildPost");

const getGuildRecruitmentPoster = async (world_name, _id) => {
  try {
    const currentGuildModel = getGuildModel(world_name);
    const recruitments = await currentGuildModel.findOne({ _id });

    return recruitments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { getGuildRecruitmentPoster };
