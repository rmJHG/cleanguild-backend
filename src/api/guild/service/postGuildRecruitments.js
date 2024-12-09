const { getGuildModel } = require("../entity/GuildPost");

const postGuildRecruitments = async (postData, publisherData) => {
  try {
    const currentGuildModel = getGuildModel(publisherData.handsData.world_name);

    const guildPost = {
      postData: {
        ...postData,
        postDate: new Date().getTime(),
      },
      publisherData,
    };
    const result = await currentGuildModel.create(guildPost);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { postGuildRecruitments };
