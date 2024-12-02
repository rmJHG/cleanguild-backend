const { postGuildRecruitments } = require("../service/postGuildRecruitments");

const postGuildRecruitmentsController = async (req, res) => {
  const { postData, publisherData } = req.body;
  try {
    const result = await postGuildRecruitments(postData, publisherData);
    res.status(200).json({ message: "저장 완료", result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "저장 실패", error });
  }
};

module.exports = { postGuildRecruitmentsController };
