const sequelize = require("../../config/db");
const { DataTypes } = require("sequelize");

const UserReviewHelpfulModel = sequelize.define(
  "UserReviewHelpful",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reviewId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    voteType: {
      type: DataTypes.ENUM("HELPFUL", "NOT_HELPFUL"),
      allowNull: false,
    },
  },
  {
    tableName: "user_review_helpful",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "reviewId"],
      },
    ],
  },
);

module.exports = UserReviewHelpfulModel;
