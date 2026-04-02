const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const { cloudinary } = require("../../config/cloudinaryConfig");

const BlogsSchema = sequelize.define(
  "blogs_schema",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // 🏷️ செய்தியின் தலைப்பு (Example: Jana Nayagan Official Update)
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 🖼️ செய்திக்கான இமேஜ் (Cloudinary URL)
    bannerImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagePublicId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 📝 லிஸ்ட் பேஜில் காட்டப்படும் சிறிய விளக்கம்
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 📖 முழு கட்டுரை / கதைச் சுருக்கம்
    longDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    /* --- IMPORTANT MOVIE CREDITS --- */
    starCast: {
      type: DataTypes.TEXT, // பலர் இருப்பதால் TEXT (Example: Vijay, Pooja Hegde...)
      allowNull: true,
    },
    directedBy: {
      type: DataTypes.STRING, // முக்கியமான கிரெடிட்
      allowNull: false,
    },
    producedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cinematography: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // 📅 ரிலீஸ் தேதி அல்லது அப்டேட் தேதி
    newsDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // 🔹 வரிசைப்படுத்துவதற்கு (Multiple banners இருந்தால்)
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "movie_blogs",
    timestamps: true,
    hooks: {
      // Delete Hook
      beforeDestroy: async (news) => {
        try {
          if (news.imagePublicId) {
            await cloudinary.uploader.destroy(news.imagePublicId);
          }
        } catch (error) {
          console.error("Cloudinary Blog Image Delete Error:", error);
        }
      },
      // Update Hook
      beforeUpdate: async (news) => {
        try {
          if (news.changed("imagePublicId")) {
            const oldId = news.previous("imagePublicId");
            if (oldId) await cloudinary.uploader.destroy(oldId);
          }
        } catch (error) {
          console.error("Cloudinary Blog Image Update Error:", error);
        }
      },
    },
  }
);

module.exports = BlogsSchema;
