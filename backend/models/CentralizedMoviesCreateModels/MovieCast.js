const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const MovieCast = sequelize.define(
  "MovieCast",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // 🔗 Foreign Keys
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // unique: true, // Oru movie-ku ore row thaan organized table-la irukkanum
      references: {
        model: "centralized_json_bulk_create", // Unga main table name (Sequelize pluralize pannum)
        key: "id",
      },
    },
    movieName: {
      type: DataTypes.STRING,
      allowNull: true, // Optional-ah vechukkalam debugging-ku useful
    },
    // Ella cast details-um intha single array kulla store aagum
    castDetails: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment:
        "Array of objects: [{castId, characterName, roleCategory, isLeadRole}]",
    },
  },
  {
    timestamps: true,
    tableName: "movie_casts",
    indexes: [
      {
        name: "idx_movie_id_unique", // Explicit name kudutha duplicate aagaathu
        unique: true,
        fields: ["movieId"],
      },
    ],
  },
);

module.exports = MovieCast;
