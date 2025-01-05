const { getGuildModel } = require("../entity/GuildPost");

const deleteGuildRecruitmentPoster = async (world_name, _id) => {
  try {
    const currentGuildModel = getGuildModel(world_name);
    const deletedRecruitment = await currentGuildModel.findOneAndDelete({ _id });

    if (!deletedRecruitment) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    return "게시글 삭제 완료";
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    throw new Error("게시글 삭제 실패");
  }
};

module.exports = { deleteGuildRecruitmentPoster };
