const { mongoose } = require("mongoose");

const GuildManagerSchema = new mongoose.Schema({
  world_name: { type: String, required: true },
  guild_name: { type: String, required: true },
  guildManagers: {
    type: [{ character_name: String, character_image: String, character_level: Number }],
    required: true,
  },
});

module.exports = mongoose.model("GuildManager", GuildManagerSchema);
