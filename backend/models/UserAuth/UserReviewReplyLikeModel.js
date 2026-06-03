const sequelize = require("../../config/db");
const { DataTypes } = require("sequelize");

const UserReviewReplyLikeModel = sequelize.define(
  "UserReviewReplyLike",
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
    replyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "user_review_reply_likes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "replyId"], // Oru user oru reply-ku oru dhave thaan like panna mudiyum
      },
    ],
  },
);

module.exports = UserReviewReplyLikeModel;
