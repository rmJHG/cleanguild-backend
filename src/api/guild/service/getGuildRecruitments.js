const { getGuildModel } = require("../entity/GuildPost");

const getGuildRecruitments = async (world_name, page = 0) => {
  try {
    const currentGuildModel = getGuildModel(world_name);
    const itemsPerPage = 20;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const totalItems = await currentGuildModel.countDocuments({
      "postData.postDate": {
        $gte: oneWeekAgo,
      },
    });

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const recruitments = await currentGuildModel
      .find({
        "postData.postDate": {
          $gte: oneWeekAgo,
        },
      })
      .skip(page * itemsPerPage)
      .limit(itemsPerPage)
      .sort({ "postData.postDate": -1 });

    console.log(Math.ceil(recruitments.length / itemsPerPage));

    return { recruitments, totalPages };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { getGuildRecruitments };

// {
//   "postData.postDate": {
//     $gte: oneWeekAgo,
//   },
// }
