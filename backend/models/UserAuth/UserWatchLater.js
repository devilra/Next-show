const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const UserAuthModel = require("./UserAuth");
const CentralizedNewsModel = require("../CentralizedNewsModels/CentralizedNewsModel");

const UserWatchLaterModel = sequelize.define(
  "UserWatchLater",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // ====================================================
    // ✅ USER ID
    // ====================================================
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
    // ====================================================
    // ✅ NEWS ID
    // ====================================================
    newsId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: CentralizedNewsModel,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    // ====================================================
    // ✅ OPTIONAL REMINDER DATE
    // ====================================================
    reminderDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "user_watch_later",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "newsId"],
        name: "unique_user_watch_later_news",
      },
    ],
  },
);

module.exports = UserWatchLaterModel;
