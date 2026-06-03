const sequelize = require("../../config/db");
const { DataTypes } = require("sequelize");

const UserReviewReplyModel = sequelize.define(
  "UserReviewReply",
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
    reply: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // ✅ ADDED: Total likes count track panna field
    totalLikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "user_review_replies",
    timestamps: true,
  },
);

module.exports = UserReviewReplyModel;
