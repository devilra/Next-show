const sequelize = require("../../config/db");
const { DataTypes } = require("sequelize");

const MovieDetailsAnalyticsModel = sequelize.define(
  "MovieDetailsAnalytics",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // ======================================================
    // ✅ MOVIE ID
    // ======================================================
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // ======================================================
    // ✅ USER ID (OPTIONAL)
    // ======================================================
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    // ======================================================
    // ✅ SESSION ID
    // ======================================================
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // ======================================================
    // ✅ IP ADDRESS
    // ======================================================
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ======================================================
    // ✅ COUNTRY
    // ======================================================
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ======================================================
    // ✅ STATE
    // ======================================================
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ======================================================
    // ✅ CITY
    // ======================================================
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ======================================================
    // ✅ DEVICE TYPE
    // ======================================================
    deviceType: {
      type: DataTypes.ENUM("MOBILE", "DESKTOP", "TABLET", "TV"),
      allowNull: true,
    },
    // ======================================================
    // ✅ BROWSER
    // ======================================================
    browser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ======================================================
    // ✅ OPERATING SYSTEM
    // ======================================================
    os: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ======================================================
    // ✅ EVENT TYPE
    // ======================================================
    eventType: {
      type: DataTypes.ENUM(
        "DETAILS_VIEW",
        "TRAILER_PLAY",
        "WATCHLIST_ADD",
        "WATCHLIST_REMOVE",
        "SHARE_CLICK",
        "REVIEW_OPEN",
        "REVIEW_SUBMIT",
        "REVIEW_LIKE",
        "CAST_OPEN",
        "OTT_CLICK",
        "IMAGE_OPEN",
        "VIDEO_OPEN",
      ),
      allowNull: false,
    },
    // ======================================================
    // ✅ TIME SPENT (SECONDS)
    // ======================================================
    timeSpent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // ======================================================
    // ✅ SESSION START
    // ======================================================
    sessionStartAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // ======================================================
    // ✅ SESSION END
    // ======================================================
    sessionEndAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }, // ======================================================
    // ✅ REFERRER
    // ======================================================
    referrer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ======================================================
    // ✅ USER AGENT
    // ======================================================
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // ======================================================
    // ✅ IS LOGGED USER
    // ======================================================
    isLoggedIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // ======================================================
    // ✅ UNIQUE VISITOR TRACKING
    // ======================================================

    visitorId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ======================================================
    // ✅ VIEW COUNTED TIME
    // ======================================================

    viewCountedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // ======================================================
    // ✅ LAST ACTIVE TIME
    // ======================================================

    lastSeenAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // ======================================================
    // ✅ EXIT PAGE
    // ======================================================

    exitPage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ======================================================
    // ✅ INTERNET PROVIDER
    // ======================================================

    isp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ======================================================
    // ✅ REGION CODE
    // ======================================================

    regionCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ======================================================
    // ✅ COUNTRY CODE
    // ======================================================

    countryCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ======================================================
    // ✅ LATITUDE
    // ======================================================

    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    // ======================================================
    // ✅ LONGITUDE
    // ======================================================

    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
  },
  {
    tableName: "movie_details_analytics",
    timestamps: true,
    indexes: [
      // ==========================================
      // ✅ MOVIE BASED SEARCH
      // ==========================================
      {
        fields: ["movieId"],
      },

      // ==========================================
      // ✅ USER BASED SEARCH
      // ==========================================
      {
        fields: ["userId"],
      },

      // ==========================================
      // ✅ SESSION SEARCH
      // ==========================================
      {
        fields: ["sessionId"],
      },

      // ==========================================
      // ✅ EVENT SEARCH
      // ==========================================
      {
        fields: ["eventType"],
      },

      // ==========================================
      // ✅ LOCATION SEARCH
      // ==========================================
      {
        fields: ["country"],
      },

      {
        fields: ["state"],
      },

      {
        fields: ["city"],
      },

      // ==========================================
      // ✅ DEVICE ANALYTICS
      // ==========================================
      {
        fields: ["deviceType"],
      },

      {
        fields: ["browser"],
      },

      {
        fields: ["os"],
      },

      // ==========================================
      // ✅ DATE FILTERING
      // ==========================================
      {
        fields: ["createdAt"],
      },

      // ==========================================
      // ✅ MOVIE + DATE ANALYTICS
      // ==========================================
      {
        fields: ["movieId", "createdAt"],
      },

      // ==========================================
      // ✅ COUNTRY + STATE ANALYTICS
      // ==========================================
      {
        fields: ["country", "state"],
      },

      // ==========================================
      // ✅ EVENT + MOVIE ANALYTICS
      // ==========================================
      {
        fields: ["movieId", "eventType"],
      },

      // ==========================================
      // ✅ USER + MOVIE ANALYTICS
      // ==========================================
      {
        fields: ["userId", "movieId"],
      },

      // ==========================================
      // ✅ VISITOR ANALYTICS
      // ==========================================
      {
        fields: ["visitorId"],
      },

      // ==========================================
      // ✅ SESSION + MOVIE LOOKUP
      // ==========================================
      {
        fields: ["sessionId", "movieId"],
      },
    ],
  },
);

module.exports = MovieDetailsAnalyticsModel;

// Dashboard La Super Analytics

// Intha table vachi nee future la:

// Total Views
// Unique Views
// Logged Users
// Guest Users
// Country Wise Views
// State Wise Views
// City Wise Views
// Device Wise Views
// Browser Wise Views
// Most Viewed Movies
// Average Time Spent
// Trailer Plays
// Watchlist Adds
// Share Clicks
// Review Opens
// Cast Opens
