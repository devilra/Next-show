const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const { cloudinary } = require("../../config/cloudinaryConfig");

const VideoSection = sequelize.define(
  "Video_section",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // 🏷️ படத்தின் தலைப்பு (உதாரணம்: Sardar 2)
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    // 🖼️ Banner Image URL (வீடியோ லோடு ஆகும் முன் தெரிவது அல்லது பேக்ரவுண்ட்)
    bannerImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // 💡 Cloudinary Image Public ID
    imagePublicId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // 🎬 Trailer Video URL (Cloudinary Video URL)
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true, // வீடியோ கட்டாயம் இல்லை என்றால்
    },

    // 💡 Cloudinary Video Public ID
    videoPublicId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // 📝 ஒருவேளை சிறிய விளக்கம் தேவைப்பட்டால்
    shortDescription: {
      type: DataTypes.TEXT,
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
    tableName: "video_section",
    timestamps: true,

    hooks: {
      // டெலீட் செய்யும் போது Cloudinary-ல் இருந்து Image & Video இரண்டையும் நீக்க
      beforeDestroy: async (banner) => {
        try {
          if (banner.imagePublicId) {
            await cloudinary.uploader.destroy(banner.imagePublicId);
          }
          if (banner.videoPublicId) {
            // வீடியோ நீக்க resource_type குறிப்பிட வேண்டும்
            await cloudinary.uploader.destroy(banner.videoPublicId, {
              resource_type: "video",
            });
          }
        } catch (error) {
          console.error("Cloudinary Delete Error:", error);
        }
      },

      // அப்டேட் செய்யும் போது பழைய ஃபைல்களை நீக்க
      beforeUpdate: async (banner) => {
        try {
          if (banner.changed("imagePublicId")) {
            const oldId = banner.previous("imagePublicId");
            if (oldId) await cloudinary.uploader.destroy(oldId);
          }
          if (banner.changed("videoPublicId")) {
            const oldVidId = banner.previous("videoPublicId");
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

module.exports = VideoSection;
