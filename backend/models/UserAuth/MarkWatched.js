const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const UserAuthModel = require("./UserAuth");
const CentralizedJsonBulkCreate = require("../CentralizedMoviesCreateModels/CentralizedJsonBulkCreate");

const MarkWatchedMovieModel = sequelize.define(
  "MarkWatchedMovie",
  {
    // ======================================================
    // ✅ ID
    // ======================================================
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // ======================================================
    // ✅ USER ID
    // ======================================================
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserAuthModel,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    // ======================================================
    // ✅ MOVIE ID
    // ======================================================
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CentralizedJsonBulkCreate,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    // ======================================================
    // ✅ WATCHED DATE
    // ======================================================
    watchedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "mark_watched_movies",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "movieId"],
        name: "unique_mark_watched_movie",
      },
    ],
  },
);

module.exports = MarkWatchedMovieModel;
