const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const MovieCast = sequelize.define(
  "MovieCast",
  {
    characterName: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., "Anbu" or "Kokki Kumar"
    },
  },
  {
    tableName: "movie_casts",
    timestamps: true,
  },
);

module.exports = MovieCast;
