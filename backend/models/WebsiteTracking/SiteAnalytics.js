const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const SiteAnalytics = sequelize.define(
  "SiteAnalytics",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // --- Session identity ---
    sessionId: {
      type: DataTypes.STRING, // UUID — oru visit = oru session
      allowNull: false,
      // unique: true,
    },
    visitorId: {
      type: DataTypes.STRING, // Cookie-la store pannuva — returning user track panna
    },
    visitorIp: {
      type: DataTypes.STRING,
    },
    // Ithu thaan andha user ethunavathu thadavai varaaru nu track pannum
    visitCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // First time varum pothu logic-padi 1-nu irukkum
    },

    // --- Page info ---
    pageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referrerUrl: {
      type: DataTypes.STRING, // Engirunthu vandha? Google, Instagram, etc.
    },

    // --- UTM / Marketing tracking ---
    utmSource: DataTypes.STRING, // google, instagram
    utmMedium: DataTypes.STRING, // cpc, organic, social
    utmCampaign: DataTypes.STRING, // campaign name

    // --- Device & Browser ---
    deviceType: {
      type: DataTypes.ENUM("mobile", "tablet", "desktop"),
    },
    browser: DataTypes.STRING, // Chrome, Safari, Firefox
    os: DataTypes.STRING, // Android, iOS, Windows, Mac
    screenResolution: DataTypes.STRING, // "1920x1080"
    language: DataTypes.STRING, // "ta", "en", "hi"

    // --- Geo location ---
    country: DataTypes.STRING,
    region: DataTypes.STRING,
    city: DataTypes.STRING,

    // --- Timing ---
    entryTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    exitTime: DataTypes.DATE,
    sessionDuration: {
      type: DataTypes.INTEGER, // seconds
      defaultValue: 0,
    },

    // --- Engagement ---
    pageLoadTime: DataTypes.INTEGER, // ms-la (performance track panna)
    scrollDepth: DataTypes.INTEGER, // % — evlo scroll pannanga (0-100)
    bounced: {
      type: DataTypes.BOOLEAN, // Only 1 page paathu poyittanga-va?
      defaultValue: false,
    },

    // --- Quality ---
    isBot: {
      type: DataTypes.BOOLEAN, // Bot traffic filter panna
      defaultValue: false,
    },
  },
  {
    indexes: [
      {
        name: "idx_session_id_unique", // Explicit name kuduppathu romba mukkiyam
        unique: true,
        fields: ["sessionId"],
      },
      {
        name: "idx_entry_time",
        fields: ["entryTime"],
      },
      {
        name: "idx_visitor_entry",
        fields: ["visitorId", "entryTime"],
      },
      {
        name: "idx_utm_entry",
        fields: ["utmSource", "entryTime"],
      },
    ],
  },
);

module.exports = SiteAnalytics;
