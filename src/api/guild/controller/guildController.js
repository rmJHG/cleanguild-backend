const { getGuildRecruitments } = require("../service/getGuildRecruitments");
const { postGuildRecruitments } = require("../service/postGuildRecruitments");
const { getGuildRecruitmentPoster } = require("../service/getGuildRecruitmentPoster");
const { getGuildRecruitmentPosterCooltime } = require("../service/getGuildRecruitmentPosterCooltime");
const GuildManager = require("../entity/GuildManager");
const { getUserPostHistoryService } = require("../service/getUserPostHistory");
const { updateGuildRecruitmentPoster } = require("../service/updateGuildRecruitmentPoster");
const { deleteGuildRecruitmentPoster } = require("../service/deleteGuildRecruitmentPoster");

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
  const { world_name, page } = req.body;
  if (!world_name) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });
  try {
    const result = await getGuildRecruitments(world_name, page);

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
const updateGuildRecruitmentPosterController = async (req, res) => {
  const { world_name, _id, postData } = req.body;

  if (!world_name || !_id || !postData) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });

  try {
    const result = await updateGuildRecruitmentPoster(world_name, _id, postData);
    console.log(result, "result");
    return res.status(200).json({ message: "업데이트 완료", result });
  } catch (error) {
    console.log(error + "error");
    return res.status(500).json({ message: "업데이트를 실패했습니다.", error });
  }
};

const deleteGuildRecruitmentPosterController = async (req, res) => {
  const { world_name, _id } = req.body;
  console.log(world_name, _id);
  if (!world_name || !_id) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });

  try {
    const result = await deleteGuildRecruitmentPoster(world_name, _id);
    if (result === "게시글 삭제 완료") {
      return res.status(200).json({ message: "삭제 완료" });
    }
  } catch (error) {
    return res.status(500).json({ message: "삭제를 실패했습니다.", error });
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
  const { world_name, guild_name } = req.query;
  if (!world_name || !guild_name) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });
  try {
    const guildManager = await GuildManager.findOne({ world_name, guild_name });
    if (!guildManager) {
      const newGuildManager = new GuildManager({ world_name, guild_name, guildManagers: [] });
      await newGuildManager.save();
    }
    return res.status(200).json(guildManager.guildManagers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "매니저 데이터를 가져오는데 실패했습니다.", error });
  }
};

const postGuildManagerController = async (req, res) => {
  const { world_name, guild_name, guildManagers } = req.body;
  if (!world_name || !guild_name || !guildManagers) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });
  try {
    const guildManager = await GuildManager.findOne({ world_name, guild_name });
    if (guildManager) {
      guildManager.guildManagers = guildManagers;
      await guildManager.save();
      return res.status(200).json({ message: "저장완료" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "저장실패", error });
  }
};

const updateGuildManagerController = async (req, res) => {
  const { world_name, guild_name, guildManagers } = req.body;
  if (!world_name || !guild_name || !guildManagers) return res.status(400).json({ message: `데이터가 유효하지 않습니다.` });
  try {
    const guildManager = await GuildManager.findOneAndUpdate(
      { world_name, guild_name },
      {
        guildManagers,
      }
    );
    console.log(guildManager);

    return res.status(200).json({ message: "업데이트 완료" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "업데이트 실패", error });
  }
};

const deleteGuildManagerController = async (req, res) => {
  const { world_name, guild_name, ocid } = req.body;
  if (!world_name || !guild_name || !ocid) {
    return res.status(400).json({ message: "데이터가 유효하지 않습니다." });
  }
  try {
    const guildManager = await GuildManager.findOne({ world_name, guild_name });
    if (!guildManager) {
      return res.status(404).json({ message: "길드 매니저를 찾을 수 없습니다." });
    }

    guildManager.guildManagers = guildManager.guildManagers.filter((currentOcid) => currentOcid !== ocid);

    await guildManager.save();

    return res.status(200).json({ message: "삭제 완료", data: guildManager });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "삭제 실패", error });
  }
};

const getUserPostHistoryController = async (req, res) => {
  const { email } = req.query;

  !email && res.status(400).json({ message: "이메일을 입력해주세요." });

  try {
    const response = await getUserPostHistoryService(email);

    !response && res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "게시글 데이터를 가져오는데 실패했습니다.", error });
  }
};
module.exports = {
  postGuildRecruitmentsController,
  getGuildRecruitmentsController,
  getGuildRecruitmentPosterController,
  updateGuildRecruitmentPosterController,
  deleteGuildRecruitmentPosterController,
  getGuildRecruitmentPosterCooltimeController,
  getGuildManagerController,
  postGuildManagerController,
  updateGuildManagerController,
  deleteGuildManagerController,
  getUserPostHistoryController,
};
