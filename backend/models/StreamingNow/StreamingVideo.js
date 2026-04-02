const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const { cloudinary } = require("../../config/cloudinaryConfig");

const StreamingNow = sequelize.define(
  "StreamVideoSection",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // 🏷️ படத்தின் தலைப்பு (e.g., THE COPENHAGEN TEST)
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // 📅 வெளியீட்டு ஆண்டு (e.g., 2025)
    releaseYear: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "2025",
    },
    // 🔞 தணிக்கை விவரம் (e.g., U/A 16+)
    certification: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "U/A 13+",
    },

    // 📺 சீசன்கள் அல்லது கால அளவு (e.g., 1 Season)
    durationOrSeason: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "1 Season",
    },
    // 🌐 மொழி (e.g., English, Tamil)
    language: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Tamil",
    },
    // 🎭 வகைகள் / Genres (e.g., Drama, Thriller, Science Fiction, Spy)
    // இதை எளிமைக்காக String ஆகவோ அல்லது Array ஆகவோ சேமிக்கலாம்
    genres: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Action | Drama",
    },
    // 📝 பெரிய விளக்கம் (Description)
    longDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // 🖼️ Banner Image URL
    bannerImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagePublicId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 🎬 Full Movie/Episode Video URL (Cloudinary)
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    videoPublicId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // 🔹 வரிசைப்படுத்துவதற்கு
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
    tableName: "streaming_now_videos",
    timestamps: true,

    hooks: {
      // Delete Hook
      beforeDestroy: async (instance) => {
        try {
          if (instance.imagePublicId) {
            await cloudinary.uploader.destroy(instance.imagePublicId);
          }
          if (instance.videoPublicId) {
            await cloudinary.uploader.destroy(instance.videoPublicId, {
              resource_type: "video",
            });
          }
        } catch (error) {
          console.error("Cloudinary Delete Error:", error);
        }
      },
      // Update Hook
      beforeUpdate: async (instance) => {
        try {
          if (instance.changed("imagePublicId")) {
            const oldId = instance.previous("imagePublicId");
            if (oldId) await cloudinary.uploader.destroy(oldId);
          }
          if (instance.changed("videoPublicId")) {
            const oldVidId = instance.previous("videoPublicId");
            if (oldVidId)
              await cloudinary.uploader.destroy(oldVidId, {
                resource_type: "video",
              });
          }
        } catch (error) {
          console.error("Cloudinary Update Error:", error);
        }
      },
    },
  }
);

module.exports = StreamingNow;
