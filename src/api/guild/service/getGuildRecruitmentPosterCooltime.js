const { getGuildModel } = require("../entity/GuildPost");

const getGuildRecruitmentPosterCooltime = async (world_name, guild_name) => {
        const currentGuildModel = getGuildModel(world_name);
  try {
    const latestPost = await currentGuildModel.findOne({
      'postData.guildName': guild_name
    })
     .exec();


    return latestPost.postData.postDate
  } catch (error) {
    throw error;
  }

}
module.exports = {
  getGuildRecruitmentPosterCooltime
};