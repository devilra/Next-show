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
