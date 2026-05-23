const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const UserAuthModel = require("./UserAuth");
const CentralizedJsonBulkCreate = require("../CentralizedMoviesCreateModels/CentralizedJsonBulkCreate");

const UserMovieRatingModel = sequelize.define(
  "UserMovieRating",
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
    // ✅ USER RATING
    // ======================================================
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    // ======================================================
    // ✅ USER REVIEW
    // ======================================================
    review: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "user_movie_ratings",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "movieId"],
        name: "unique_user_movie_rating",
      },
    ],
  },
);

module.exports = UserMovieRatingModel;
