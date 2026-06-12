const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const slugify = require("slugify");

const MEDIA_TYPE_ENUM = [
  // Announcement Stage

  "ANNOUNCEMENT",

  "TITLE_REVEAL",

  "FIRST_LOOK",

  "MOTION_POSTER",

  "CHARACTER_POSTER",

  // Video Content

  "GLIMPSE",

  "TEASER",

  "TEASER_2",

  "TRAILER",

  "TRAILER_2",

  "FINAL_TRAILER",

  // Songs

  "SONG",

  "LYRIC_VIDEO",

  "JUKEBOX",

  "AUDIO_LAUNCH",

  // Promotions

  "PROMO",

  "TV_SPOT",

  "SPECIAL_VIDEO",

  // Interviews

  "INTERVIEW",

  "PRESS_MEET",

  "PRESS_CONFERENCE",

  // Behind The Scenes

  "BEHIND_THE_SCENES",

  "MAKING_VIDEO",

  "VFX_BREAKDOWN",

  // Character / Cast

  "CAST_INTRODUCTION",

  "CHARACTER_INTRO",

  // Public Response

  "PUBLIC_REVIEW",

  "FAN_SHOW_REACTION",

  "SUCCESS_MEET",

  "THANK_YOU_VIDEO",
];

const CentralizedTrailerTeaser = sequelize.define(
  "CentralizedTrailerTeaser",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // movieId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    // },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaType: {
      type: DataTypes.ENUM(...MEDIA_TYPE_ENUM),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "SCHEDULED",
        "RELEASED",
        "CANCELLED",
        "POSTPONED",
        "DELETED",
      ),
      allowNull: false,
      defaultValue: "SCHEDULED",
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    youtubeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    youtubeVideoId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    longDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    releasedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isOfficial: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    totalViews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalReminders: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalLikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    additionalFields: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        castHighlights: [],
        keyMoments: [],
        tags: [],
        relatedMedia: [],
      },
    },
  },
  {
    tableName: "centralized_trailer_teaser",
    timestamps: true,

    hooks: {
      beforeValidate: (media) => {
        if (media.title && !media.slug) {
          media.slug = slugify(media.title, {
            lower: true,
            strict: true,
            trim: true,
          });
        }
      },

      beforeSave: (media) => {
        // Youtube URL → Video ID + Thumbnail

        if (media.youtubeUrl) {
          const match = media.youtubeUrl.match(
            /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
          );

          if (match?.[2]) {
            media.youtubeVideoId = match[2];

            media.thumbnail = `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
          }
        }

        // Released At

        if (media.status === "RELEASED" && !media.releasedAt) {
          media.releasedAt = new Date();
        }
      },
    },

    indexes: [
      {
        unique: true,
        fields: ["slug"],
      },
      {
        unique: true,
        fields: ["youtubeVideoId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["mediaType"],
      },
      {
        fields: ["scheduledAt"],
      },
    ],
  },
);

module.exports = CentralizedTrailerTeaser;
