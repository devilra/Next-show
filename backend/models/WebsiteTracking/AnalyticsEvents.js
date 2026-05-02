const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const AnalyticsEvents = sequelize.define("AnalyticsEvents", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // SiteAnalytics-oda relation
  analyticsId: {
    type: DataTypes.INTEGER,
    references: { model: "SiteAnalytics", key: "id" },
  },

  // Session ID ingaiyum duplicate pannina JOIN query speed increase aagum
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Enna event? click, search, trailer_play, wishlist_add...
  eventType: {
    type: DataTypes.ENUM(
      "click",
      "search",
      "trailer_play",
      "wishlist_add",
      "share",
      "download",
      "form_submit",
      "scroll_milestone",
      "video_start",
      "video_complete",
      "custom",
    ),
    allowNull: false,
  },

  eventTarget: DataTypes.STRING, // "#watch-btn", "/movie/amran", "search-bar"
  eventValue: DataTypes.STRING, // "amran", "50%", "whatsapp"

  // Click coordinate (heatmap-ku useful)
  xPosition: DataTypes.INTEGER,
  yPosition: DataTypes.INTEGER,

  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  // Extra details — flexible JSON
  extraData: DataTypes.JSON,
});

module.exports = AnalyticsEvents;
