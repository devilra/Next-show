const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const TagsModel = sequelize.define(
  "TagsModel",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50], // Tag name length limit
      },
    },
    tagType: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        this.setDataValue("tagType", val.trim());
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "#007bff", // Default blue color
      validate: {
        is: /^#[0-9A-F]{6}$/i, // Hex color validation
      },
    },
  },
  {
    tableName: "tags",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["slug"], // Name-ku pathila slug-ah index pannanum
      },
      {
        fields: ["name"], // Search fast-ah irukka name-ku normal index
      },
      {
        fields: ["tagType"], // tagType-ku index pannanum for filtering (e.g., genre, theme)
      },
    ],
  },
);

module.exports = TagsModel;
