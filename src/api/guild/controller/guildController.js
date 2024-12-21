const { getGuildRecruitments } = require("../service/getGuildRecruitments");
const { postGuildRecruitments } = require("../service/postGuildRecruitments");
const { getGuildRecruitmentPoster } = require("../service/getGuildRecruitmentPoster");
const { getGuildRecruitmentPosterCooltime } = require("../service/getGuildRecruitmentPosterCooltime");
const GuildManager = require("../entity/GuildManager");

const postGuildRecruitmentsController = async (req, res) => {
  const { postData, publisherData } = req.body;
  console.log(postData);
  if (!postData || !publisherData) res.status(400).json({ message: "데이터가 없습니다." });
  try {
    const result = await postGuildRecruitments(postData, publisherData);
    console.log(result);
    return res.status(200).json({ message: "저장 완료", result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "저장 실패", error });
  }
};

const getGuildRecruitmentsController = async (req, res) => {
  const { world_name } = req.body;
  if (!world_name) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });
  try {
    const result = await getGuildRecruitments(world_name);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "게시글 데이터를 가져오는데 실패했습니다.", error });
  }
};

const getGuildRecruitmentPosterController = async (req, res) => {
  const { world_name, _id } = req.body;
  if (!world_name || !_id) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });
  try {
    const result = await getGuildRecruitmentPoster(world_name, _id);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "게시글 데이터를 가져오는데 실패했습니다.", error });
  }
};

const getGuildRecruitmentPosterCooltimeController = async (req, res) => {
  const { world_name, guild_name } = req.body;
  if (!world_name || !guild_name) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });
  try {
    const result = await getGuildRecruitmentPosterCooltime(world_name, guild_name);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "게시글 데이터를 가져오는데 실패했습니다.", error });
  }
};

const getGuildManagerController = async (req, res) => {
  const { world_name, guild_name } = req.body;
  if (!world_name || !guild_name) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });
  try {
    const guildManager = await GuildManager.findOne({ world_name, guild_name });
    console.log(guildManager);

    return res.status(200).json(guildManager);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "게시글 데이터를 가져오는데 실패했습니다.", error });
  }
};

const postGuildManagerController = async (req, res) => {
  const { world_name, guild_name, guildManagers } = req.body;
  if (!world_name || !guild_name || !guildManagers)
    return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });
  try {
    const guildManager = await GuildManager.findOne({ world_name, guild_name });
    if (guildManager) {
      guildManager.guildManagers = guildManagers;
      await guildManager.save();
    } else {
      const newGuildManager = new GuildManager({ world_name, guild_name, guildManagers });
      await newGuildManager.save();
    }

    return res.status(200).json({ message: "저장완료" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "저장실패", error });
  }
};

module.exports = {
  postGuildRecruitmentsController,
  getGuildRecruitmentsController,
  getGuildRecruitmentPosterController,
  getGuildRecruitmentPosterCooltimeController,
  getGuildManagerController,
  postGuildManagerController,
};
