const sequelize = require("../../config/db");
const { DataTypes } = require("sequelize");

const UserReviewLikeModel = sequelize.define(
  "UserReviewLike",
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
    reviewId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "user_review_likes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "reviewId"],
      },
    ],
  },
);

module.exports = UserReviewLikeModel;
