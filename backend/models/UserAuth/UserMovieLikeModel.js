const sequelize = require("../../config/db");
const { DataTypes } = require("sequelize");

const UserMovieLikeModel = sequelize.define(
  "UserMovieLike",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "user_movie_likes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "movieId"],
      },
    ],
  },
);

module.exports = UserMovieLikeModel;
