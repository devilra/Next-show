const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const { cloudinary } = require("../../config/cloudinaryConfig");
const { v4: uuidv4 } = require("uuid");

// ─────────────────────────────────────────────────────────────
//  CAST MODEL — Full Professional Schema
// ─────────────────────────────────────────────────────────────

const Cast = sequelize.define(
  "Cast",
  {
    // ── PRIMARY KEY ──────────────────────────────────────────
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // ── BASIC IDENTITY ───────────────────────────────────────
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      // unique: true, // Same name thirumba vara koodathu
      comment: "Full stage/screen name",
    },
    realName: {
      type: DataTypes.STRING(150),
      allowNull: true,
      comment: "Birth name / real name",
    },
    slug: {
      type: DataTypes.STRING(180),
      allowNull: false,
      unique: true, // URL-friendly: rajinikanth, vijay-sethupathi
      comment: "URL slug for actor profile page",
    },
    gender: {
      type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
      allowNull: false,
      comment: "Actor or Actress",
    },
    profession: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: ["Actor"],
      comment:
        "['Actor'], ['Actress'], ['Actor','Director'], ['Actor','Singer'] etc.",
    },

    // ── PERSONAL DETAILS ─────────────────────────────────────
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "YYYY-MM-DD format",
    },
    placeOfBirth: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "City, State, Country",
    },
    nationality: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "Indian",
    },
    languages: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "['Tamil','Telugu','Hindi'] — languages they act/work in",
    },
    religion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    // ── PHYSICAL DETAILS ─────────────────────────────────────
    height: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "e.g. '5 ft 11 in' or '180 cm'",
    },
    weight: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "e.g. '75 kg'",
    },
    eyeColor: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    hairColor: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    // ── PROFESSIONAL DETAILS ─────────────────────────────────
    debutYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Year of first film/appearance",
    },
    debutMovie: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "Name of debut film",
    },
    activeYears: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "e.g. '2010–present' or '1995–2010'",
    },
    primaryIndustry: {
      type: DataTypes.ENUM(
        "KOLLYWOOD", // Tamil
        "TOLLYWOOD", // Telugu
        "BOLLYWOOD", // Hindi
        "MOLLYWOOD", // Malayalam
        "SANDALWOOD", // Kannada
        "HOLLYWOOD",
        "OTHER",
      ),
      allowNull: false,
      // defaultValue: "KOLLYWOOD",
    },
    otherIndustries: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Other film industries they work in",
    },
    knownFor: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "['Mersal','Vikram','Leo'] — notable films",
    },
    genres: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "['Action','Comedy','Drama'] — genres they are known for",
    },
    typicalRole: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "HERO",
      comment: "Primary role type in films",
    },

    // ── RATINGS & POPULARITY ─────────────────────────────────
    popularityScore: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
      comment: "Internal popularity score 0–100",
    },
    fanbaseSize: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Relative fanbase size",
    },
    isTrending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // ── IMAGES ───────────────────────────────────────────────
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Main profile photo URL (Cloudinary etc.)",
    },
    profileImagePublicId: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "Cloudinary public_id for deletion/update",
    },
    bannerImage: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Wide banner image for profile page header",
    },
    galleryImages: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of image URLs for gallery",
    },

    // ── SOCIAL MEDIA & LINKS ─────────────────────────────────
    instagramUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    twitterUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    facebookUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    youtubeUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    wikipediaUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imdbUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ── BIOGRAPHY ────────────────────────────────────────────
    shortBio: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "One-liner / short description for cards",
    },
    longBio: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Full biography for profile page",
    },

    // ── AWARDS & ACHIEVEMENTS ────────────────────────────────
    awardsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Total number of awards won",
    },
    notableAwards: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "[{ award: 'National Award', year: 2022, film: 'Jai Bhim' }]",
    },

    // ── PERSONAL LIFE (Optional) ─────────────────────────────
    maritalStatus: {
      type: DataTypes.ENUM(
        "SINGLE",
        "MARRIED",
        "DIVORCED",
        "WIDOWED",
        "UNKNOWN",
      ),
      allowNull: true,
      defaultValue: "UNKNOWN",
    },
    spouseName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    children: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Number of children",
    },

    // ── NET WORTH ────────────────────────────────────────────
    netWorth: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "e.g. '₹500 Crore' or '$60 Million'",
    },

    // ── SEO ──────────────────────────────────────────────────
    metaTitle: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    // ── STATUS ───────────────────────────────────────────────
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Show/hide in frontend",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Verified / manually reviewed profile",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Display order for featured cast",
    },
  },

  {
    tableName: "casts",
    timestamps: true, // createdAt, updatedAt auto
    paranoid: true, // deletedAt — soft delete
    hooks: {
      // 🗑️ Actor record delete aagumbothu Cloudinary-la image delete aagum
      beforeDestroy: async (instance) => {
        try {
          if (instance.profileImagePublicId) {
            await cloudinary.uploader.destroy(instance.profileImagePublicId);
          }
        } catch (error) {
          console.error("Cast Cloudinary Delete Error:", error);
        }
      },
    },
    // 🔄 Actor image-ah update pannumbothu pazhaya image-ah Cloudinary-la irundhu remove pannum
    beforeDestroy: async (instance) => {
      try {
        if (instance.changed("profileImagePublicId")) {
          const oldId = instance.previous("profileImagePublicId");
          if (oldId) await cloudinary.uploader.destroy(oldId);
        }
      } catch (error) {
        console.error("Cast Cloudinary Update Error:", error);
      }
    },
    indexes: [
      { unique: true, fields: ["slug"] },
      { fields: ["gender"] },
      { fields: ["primaryIndustry"] },
      { fields: ["isTrending"] },
      { fields: ["isActive"] },
      { fields: ["popularityScore"] },
    ],
  },
);

module.exports = Cast;

// ─────────────────────────────────────────────────────────────
//  FIELD SUMMARY
// ─────────────────────────────────────────────────────────────
//
//  CATEGORY              FIELDS
//  ─────────────────     ──────────────────────────────────────
//  Primary Key     (1)   id
//  Basic Identity  (5)   name, realName, slug, gender, profession
//  Personal        (5)   dateOfBirth, placeOfBirth, nationality,
//                        languages, religion
//  Physical        (4)   height, weight, eyeColor, hairColor
//  Professional    (9)   debutYear, debutMovie, activeYears,
//                        primaryIndustry, otherIndustries,
//                        knownFor, genres, typicalRole, fanbaseSize
//  Popularity      (3)   popularityScore, fanbaseSize, isTrending
//  Images          (4)   profileImage, profileImagePublicId,
//                        bannerImage, galleryImages
//  Social Links    (6)   instagram, twitter, facebook,
//                        youtube, wikipedia, imdb
//  Biography       (2)   shortBio, longBio
//  Awards          (2)   awardsCount, notableAwards
//  Personal Life   (3)   maritalStatus, spouseName, children
//  Net Worth       (1)   netWorth
//  SEO             (2)   metaTitle, metaDescription
//  Status          (4)   isActive, isVerified, order
//  Auto            (3)   createdAt, updatedAt, deletedAt
//  ─────────────────     ──────────────────────────────────────
//  TOTAL                 ~54 fields
