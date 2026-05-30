const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const UserAuthModel = require("./UserAuth");
const CentralizedNewsModel = require("../CentralizedNewsModels/CentralizedNewsModel");

const UserNewsLikeModel = sequelize.define(
  "UserNewsLike",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // ============================================
    // ✅ USER
    // ============================================

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

    // ============================================
    // ✅ NEWS
    // ============================================

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
  },
  {
    tableName: "user_news_likes",

    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ["userId", "newsId"],
        name: "unique_user_news_like",
      },
    ],
  },
);

module.exports = UserNewsLikeModel;
