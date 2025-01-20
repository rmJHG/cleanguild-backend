const { mongoose } = require("mongoose");

const CharDataSchema = new mongoose.Schema({
  access_flag: String,
  character_name: String,
  character_class: String,
  character_class_level: String,
  character_exp: Number,
  character_gender: String,
  character_guild_name: String,
  character_image: String,
  character_level: Number,
  date: { type: String, default: null },
  world_name: String,
  mainCharOcid: String,
  currentCharOcid: String,
  popularity: Number,
  character_date_create: String,
  character_exp_rate: String,
  liberation_quest_clear_flag: String,
  lastUpdateDate: String,
});

module.exports = mongoose.model("CharData", CharDataSchema);
