const sequelize = require("../../config/db");
const { DataTypes } = require("sequelize");

const UserReviewReportModel = sequelize.define(
  "UserReviewReport",
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
    // ✅ REVIEW ID
    // ======================================================
    reviewId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // ======================================================
    // ✅ REPORTED USER
    // ======================================================
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // ======================================================
    // ✅ REPORT REASON
    // ======================================================
    reason: {
      type: DataTypes.ENUM(
        "SPAM",
        "ABUSIVE",
        "FAKE_REVIEW",
        "SPOILER",
        "HARASSMENT",
        "OTHER",
      ),
      allowNull: false,
    },

    // ======================================================
    // ✅ OPTIONAL DESCRIPTION
    // ======================================================
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ======================================================
    // ✅ REPORT STATUS
    // ======================================================
    status: {
      type: DataTypes.ENUM("PENDING", "REVIEWED", "REJECTED", "REMOVED"),
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "user_review_reports",
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ["userId", "reviewId"],
      },
    ],
  },
);

module.exports = UserReviewReportModel;
