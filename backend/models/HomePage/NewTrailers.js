const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const NewTrailer = sequelize.define(
  "NewTrailer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // 🏷️ படத்தின் பெயர் (எ.கா: Jailer)
    movieName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 📝 வீடியோவின் தலைப்பு (எ.கா: Official Showcase)
    videoTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 🔗 YouTube Full URL (அட்மின் கொடுக்கும் லிங்க் அப்படியே இங்கே சேமிக்கப்படும்)
    // எ.கா: https://youtu.be/zPqMbwmGC1U
    trailerUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 🕒 Posted Time (எ.கா: "2 days ago", "Just now")
    postedTimeDisplay: {
      type: DataTypes.STRING(50),
      defaultValue: "Just now",
    },
    // ↕️ வரிசைமுறை
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    // 🟢 ஸ்டேட்டஸ்
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "new_trailers",
    timestamps: true,
  },
);

module.exports = NewTrailer;
