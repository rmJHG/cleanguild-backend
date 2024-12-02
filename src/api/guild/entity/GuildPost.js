const { mongoose } = require("mongoose");

const GuildRecruitmentSchema = new mongoose.Schema({
  postData: {
    currentNoblePoint: Number,
    description: String,
    createdAt: Date,
    guildName: String,
    guildType: String,
    limitedLevel: Number,
    postDate: Number,
    suroPoint: Number,
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
  ["reboot", "리부트"],
  ["reboot", "리부트2"],
  ["burning", "버닝"],
  ["burning", "버닝2"],
  ["burning", "버닝3"],
];

const getGuildModel = (serverName) => {
  const serverInfo = serverList.find((server) => server[0] === serverName || server[1] === serverName);

  if (!serverInfo) {
    throw new Error("Invalid server name");
  }

  const collectionName = `${serverInfo[0]}_guildRecruitments`;
  return mongoose.model(collectionName, GuildRecruitmentSchema);
};

module.exports = { getGuildModel };