const { getGuildRecruitments } = require("../service/getGuildRecruitments");
const { postGuildRecruitments } = require("../service/postGuildRecruitments");
const { getGuildRecruitmentPoster } = require("../service/getGuildRecruitmentPoster");
const { getGuildRecruitmentPosterCooltime } = require("../service/getGuildRecruitmentPosterCooltime");

const postGuildRecruitmentsController = async (req, res) => {
  const { postData, publisherData } = req.body;
  if (!postData || !publisherData) res.status(400).json({ message: "데이터가 없습니다." });
  try {
    const result = await postGuildRecruitments(postData, publisherData);
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

module.exports = {
  postGuildRecruitmentsController,
  getGuildRecruitmentsController,
  getGuildRecruitmentPosterController,
  getGuildRecruitmentPosterCooltimeController,
};
