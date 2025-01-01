const mongoose = require("mongoose");

const serverList = [
  ["luna", "루나"],
  ["scania", "스카니아"],
  ["bera", "베라"],
  ["croa", "크로아"],
  ["elysium", "엘리시움"],
  ["zenis", "제니스"],
  ["red", "레드"],
  ["aurora", "오로라"],
  ["union", "유니온"],
  ["nova", "노바"],
  ["arcane", "아케인"],
  ["enosis", "이노시스"],
  ["eos", "에오스"],
  ["helios", "헬리오스"],
];

const GuildRecruitmentSchema = new mongoose.Schema({
  postData: {
    currentNoblePoint: Number,
    description: String,
    discordLink: String,
    guildContents: String,
    guildMemberCount: Number,
    guildName: String,
    guildType: String,
    limitedLevel: Number,
    limitedSuroPoint: Number,
    limitedFlagPoint: Number,
    postDate: Number,
    managerNameArr: [String],
    guildLevel: Number,
    openKakaotalkLink: String,
    title: String,
  },
  publisherData: {
    email: String,
    handsData: {
      character_guild_name: String,
      character_name: String,
      character_image: String,
      world_name: String,
    },
  },
});

const getUserPostHistoryService = async (email) => {
  try {
    const allPostsByServer = {};
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7일 전 타임스탬프 계산

    for (const [serverName, serverDisplayName] of serverList) {
      const collectionName = `${serverName}_guildRecruitments`;
      let GuildModel;
      if (mongoose.models[collectionName]) {
        GuildModel = mongoose.model(collectionName);
      } else {
        GuildModel = mongoose.model(collectionName, GuildRecruitmentSchema);
      }

      const posts = await GuildModel.find(
        {
          "publisherData.email": email,
          "postData.postDate": { $gte: oneWeekAgo },
        },
        {
          "postData.title": 1,
          "postData.postDate": 1,
          "postData.guildName": 1,
          "publisherData.email": 1,
        }
      ).sort({ "postData.postDate": -1 });

      if (posts.length > 0) {
        allPostsByServer[serverDisplayName] = posts;
      }
    }

    return allPostsByServer;
  } catch (error) {
    console.error("서버 오류:", error);
    return { message: "오류 발생", error };
  }
};

module.exports = { getUserPostHistoryService };
