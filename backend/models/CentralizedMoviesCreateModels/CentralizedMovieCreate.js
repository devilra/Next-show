const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const { cloudinary } = require("../../config/cloudinaryConfig");

const CentralizedMovieCreate = sequelize.define(
  "CentralizedMovieCreate",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // 🏷️ Padathoda Peru
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    // 📺 "New Movies" section-la intha movie varanuma?
    showInNewMovies: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // 🎬 "Streaming Now" section-la intha movie varanuma?
    showInStreamingNow: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // 🚦 Padathoda tharpothaiya nilai (Upcoming-aa illai release aayiducha?)
    status: {
      type: DataTypes.ENUM("UPCOMING", "RELEASED", "TRENDING"),
      defaultValue: "UPCOMING",
    },

    // 🎬 Section classification (Old ENUM - Optional, if you use Boolean flags above)
    streamType: {
      type: DataTypes.ENUM("TRENDING", "UPCOMING", "NEW_RELEASE"),
      allowNull: false,
      defaultValue: "NEW_RELEASE",
    },

    // 🎥 Iyakkunar (Director)
    director: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "TBA", // To Be Announced
    },
    // 👥 Nadigargal (Cast)
    cast: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    // 📅 Release Date (DD-MM-YYYY)
    releaseDate: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "TBA",
    },
    // 📅 Theater Release Date
    theatreReleaseDate: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "TBA",
    },

    // 📅 OTT Release Date
    ottReleaseDate: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "TBA",
    },
    // 🔞 Censor Certificate (U, U/A, A)
    certification: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "U/A 18+",
    },
    // 📺 Runtime (e.g., 2h 30m)
    durationOrSeason: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "N/A",
    },
    // 🌐 Primary Language
    language: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: "Tamil", // Unga primary language-ai default-ah vachukalam
    },
    // ⭐ IMDb Score
    imdbRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    // 👨‍💻 Namma user-ga kudukura rating
    userRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    // 🗳️ Total votes count
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // 👁️ Page views count
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // 🔥 Trending badge control (UI icons-ku useful)
    isTrending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // 🎬 Trailer link (YouTube)
    trailerUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    // 📺 Platform (Netflix, Prime, etc.)
    availableOn: {
      type: DataTypes.STRING,
      defaultValue: "Theatres", // Default-ah theatre release-nu vachukalam
    },
    // 🔗 OTT link or Ticket booking link
    watchUrl: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    // 🎵 Music Director
    musicDirector: {
      type: DataTypes.STRING,
      defaultValue: "N/A",
    },
    // 🎥 Cinematographer
    cinematography: {
      type: DataTypes.STRING,
      defaultValue: "N/A",
    },
    // 🏢 Production House
    productionHouse: {
      type: DataTypes.STRING,
      defaultValue: "N/A",
    },
    // 🔗 SEO Friendly URL
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    // 🔍 SEO Title
    metaTitle: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    // 📄 SEO Description
    metaDescription: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    // 🎭 Genre
    genres: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: ["Drama"], // Common genre
    },
    // 📝 Long Description
    longDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    // 🖼️ Cloudinary Image URL
    bannerImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 🆔 Cloudinary ID
    imagePublicId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 🔹 Sort order
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    // 🟢 Record status
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "centralized_movie_create",
    timestamps: true,
    hooks: {
      beforeDestroy: async (instance) => {
        try {
          if (instance.imagePublicId) {
            await cloudinary.uploader.destroy(instance.imagePublicId);
          }
        } catch (error) {
          console.error("Cloudinary Delete Error:", error);
        }
      },
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

module.exports = CentralizedMovieCreate;
