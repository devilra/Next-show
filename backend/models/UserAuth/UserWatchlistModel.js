// ======================================================
// ✅ USER WATCHLIST MODEL
// ======================================================

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const UserAuthModel = require("./UserAuth");
const CentralizedJsonMovieCreate = require("../CentralizedMoviesCreateModels/CentralizedJsonBulkCreate");
const UserWatchlistModel = sequelize.define(
  "UserWatchlist",
  {
    // ======================================================
    // ✅ ID
    // ======================================================
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
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
        model: CentralizedJsonMovieCreate,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "user_watchlists",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "movieId"],
        name: "unique_user_watchlist_movie",
      },
    ],
  },
);

module.exports = UserWatchlistModel;
