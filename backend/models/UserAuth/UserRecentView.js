const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const UserAuthModel = require("./UserAuth");

const UserRecentViewModel = sequelize.define(
  "UserRecentView",
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
    // ✅ CONTENT TYPE
    // ======================================================
    contentType: {
      type: DataTypes.ENUM("MOVIE", "NEWS", "WEBSERIES", "TRAILER"),
      allowNull: false,
    },
    // ======================================================
    // ✅ CONTENT ID
    // ======================================================

    contentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // ======================================================
    // ✅ VIEWED TIME
    // ======================================================
    viewedAt: {
      type: DataTypes.DATE,

      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "user_recent_views",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "contentType", "contentId"],
        name: "unique_user_recent_content_view",
      },
    ],
  },
);

module.exports = UserRecentViewModel;
