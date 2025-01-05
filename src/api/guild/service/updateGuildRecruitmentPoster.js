const { getGuildModel } = require("../entity/GuildPost");

const updateGuildRecruitmentPoster = async (world_name, guildId, recruitmentPoster) => {
  try {
    const currentGuildModel = getGuildModel(world_name);
    const guild = await currentGuildModel.findOneAndUpdate(
      { _id: guildId },
      {
        $set: {
          "postData.currentNoblePoint": recruitmentPoster.currentNoblePoint,
          "postData.description": recruitmentPoster.description,
          "postData.discordLink": recruitmentPoster.discordLink,
          "postData.guildContents": recruitmentPoster.guildContents,
          "postData.guildMemberCount": recruitmentPoster.guildMemberCount,
          "postData.guildName": recruitmentPoster.guildName,
          "postData.guildType": recruitmentPoster.guildType,
          "postData.limitedLevel": recruitmentPoster.limitedLevel,
          "postData.limitedSuroPoint": recruitmentPoster.limitedSuroPoint,
          "postData.limitedFlagPoint": recruitmentPoster.limitedFlagPoint,
          "postData.managerNameArr": recruitmentPoster.managerNameArr,
          "postData.guildLevel": recruitmentPoster.guildLevel,
          "postData.openKakaotalkLink": recruitmentPoster.openKakaotalkLink,
          "postData.title": recruitmentPoster.title,
        },
      },
      { new: true }
    );
    console.log(guild);
    return "게시글 업데이트 완료";
  } catch (error) {
    console.log(error);
    throw "게시글 업데이트 실패";
  }
};

module.exports = { updateGuildRecruitmentPoster };
