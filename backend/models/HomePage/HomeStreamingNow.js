const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const { cloudinary } = require("../../config/cloudinaryConfig");

const HomeStreamingNow = sequelize.define(
  "HomeStreamingNow",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // 🏷️ படத்தின் தலைப்பு (e.g., JANA NAYAGAN)
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    // 🎬 ஸ்ட்ரீமிங் வகை (TRENDING, UPCOMING, NEW மட்டும்)
    streamType: {
      type: DataTypes.ENUM("TRENDING", "UPCOMING", "NEW"),
      allowNull: false,
      defaultValue: "NEW", // டீஃபால்ட்டாக 'NEW' என இருக்கும்
    },

    // 🎬 இயக்குநர் (e.g., Nelson Dilipkumar)
    director: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // 👥 நடிகர்கள் (e.g., Rajinikanth, Mohanlal...)
    cast: {
      type: DataTypes.TEXT, // அதிகமான பெயர்கள் வரலாம் என்பதால் TEXT
      allowNull: true,
    },
    // 📅 வெளியீட்டுத் தேதி (Format: YYYY-MM-DD or DD-MM-YYYY as String)
    releaseDate: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    // 🔞 தணிக்கை விவரம் (e.g., U/A 16+)
    certification: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "U/A 18+",
    },
    // 📺 கால அளவு அல்லது சீசன் (e.g., 1 Season / 2h 45m)
    durationOrSeason: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // 🌐 மொழி (e.g., Tamil)
    language: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    // 🎭 வகைகள் (e.g., Action | Thriller)
    genres: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // 📝 பெரிய விளக்கம்
    longDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // 🖼️ Poster / Banner Image
    bannerImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagePublicId: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "home_streaming_now",
    timestamps: true,
    hooks: {
      // டேட்டாவை அழிக்கும்போது Cloudinary இமேஜையும் அழிக்க
      beforeDestroy: async (instance) => {
        try {
          if (instance.imagePublicId) {
            await cloudinary.uploader.destroy(instance.imagePublicId);
          }
        } catch (error) {
          console.error("Cloudinary Delete Error:", error);
        }
      },
      // அப்டேட் செய்யும்போது பழைய இமேஜை நீக்க
      beforeUpdate: async (instance) => {
        try {
          if (instance.changed("imagePublicId")) {
            const oldId = instance.previous("imagePublicId");
            if (oldId) await cloudinary.uploader.destroy(oldId);
          }
        } catch (error) {
          console.error("Cloudinary Update Error:", error);
        }
      },
    },
  }
);

module.exports = HomeStreamingNow;
