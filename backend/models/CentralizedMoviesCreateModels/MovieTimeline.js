const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const MovieTimeline = sequelize.define(
  "MovieTimeline",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // 🔗 Centralized Movie Table-oda ID inga thaan varum
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "centralized_movie_create", // main table name
        key: "id",
      },
      onDelete: "CASCADE", // Movie delete aana automatic-ah timeline-um delete aagum
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    release_date: {
      type: DataTypes.DATE,
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
    },
    language: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: "Tamil", // Unga primary language-ai default-ah vachukalam
    },
    industry: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.FLOAT,
    },
    poster_url: {
      type: DataTypes.STRING,
    },
    // 🎬 Plot (Short & Full Description)
    plot: {
      type: DataTypes.JSON,
      // Structure: { "short": "...", "full": "..." }
    },
    // 🎭 Characters + Actors (Array of objects)
    characters: {
      type: DataTypes.JSON,
      // Structure: [{ "id": "", "name": "", "role": "", "actor": { "id": "", "name": "", "profile_url": "" } }]
    },
    // ⏱️ Timeline (MAIN ENGINE 🔥)
    timelines: {
      type: DataTypes.JSON,
      /* Structure Example:
      [{
        "id": "uuid",
        "title": "Interval Block",
        "description": "Critical revelation scene",
        "type": "action", 
        "sequence_order": 1, 
        "start_time": 60, 
        "end_time": 75,
        "location_name": "Goa",
        "emotion_type": "intense",
        "is_twist": true,
        "is_climax": false,
        "is_flashback": false,
        "importance_score": 10,
        "famous_dialogue": "...",
        "characters_involved": [{ "id": "", "name": "" }],
        "media": [{ "type": "image", "url": "" }]
      }]
    */
    },
  },
  {
    timestamps: true,
    underscored: true, // DB-la movie_id nu save aagum
    tableName: "movie_timelines",
  },
);

module.exports = MovieTimeline;
