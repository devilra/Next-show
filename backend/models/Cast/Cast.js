const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const { cloudinary } = require("../../config/cloudinaryConfig");

const Cast = sequelize.define(
  "Cast",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // 🚫 Same name thirumba vara koodathu
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
      defaultValue: "Male",
    },
    profileImage: {
      type: DataTypes.STRING, // Cloudinary URL
      allowNull: false,
    },
    imagePublicId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "casts",
    timestamps: true,
    hooks: {
      // 🗑️ Actor record delete aagumbothu Cloudinary-la image delete aagum
      beforeDestroy: async (instance) => {
        try {
          if (instance.imagePublicId) {
            await cloudinary.uploader.destroy(instance.imagePublicId);
          }
        } catch (error) {
          console.error("Cast Cloudinary Delete Error:", error);
        }
      },
      // 🔄 Actor image-ah update pannumbothu pazhaya image-ah Cloudinary-la irundhu remove pannum
      beforeUpdate: async (instance) => {
        try {
          if (instance.changed("imagePublicId")) {
            const oldId = instance.previous("imagePublicId");
            if (oldId) await cloudinary.uploader.destroy(oldId);
          }
        } catch (error) {
          console.error("Cast Cloudinary Update Error:", error);
        }
      },
    },
  },
);

module.exports = Cast;
