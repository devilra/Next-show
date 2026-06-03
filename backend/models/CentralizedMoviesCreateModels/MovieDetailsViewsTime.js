const UAParser = require("ua-parser-js");
const axios = require("axios");
const MovieDetailsAnalyticsModel = require("./MovieDetailsAnalyticsModel");

exports.startMovieSession = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { movieId, sessionId, visitorId } = req.body;
    if (!movieId || !sessionId) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "movieId and sessionId required",
      });
    }
    // =====================================
    // IP ADDRESS
    // =====================================
    const forwardedIp = req.headers["x-forwarded-for"]?.split(",")[0];
    const ipAddress = forwardedIp || req.socket.remoteAddress || null;
    // =====================================
    // USER AGENT
    // =====================================
    const userAgent = req.headers["user-agent"] || "";
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser().name || null;
    const os = parser.getOs().name || null;
    const deviceType = parser.getDevice().type?.toUpperCase() || "DESKTOP";

    // =====================================
    // ✅ GEO LOCATION DEFAULTS
    // =====================================
    let country = null;
    let state = null;
    let city = null;
    let countryCode = null;
    let regionCode = null;
    let latitude = null;
    let longitude = null;
    let isp = null;
    // =====================================
    // ✅ GEO LOOKUP FROM IP
    // =====================================
    try {
      const geoResponse = await axios.get(
        `http://ip-api.com/json/${ipAddress}?fields=status,country,countryCode,region,regionName,city,lat,lon,isp`,
      );
      const geo = geoResponse.data;
      if (geo?.status === "success") {
        country = geo.country || null;

        state = geo.regionName || null;

        city = geo.city || null;

        countryCode = geo.countryCode || null;

        regionCode = geo.region || null;

        latitude = geo.lat || null;

        longitude = geo.lon || null;

        isp = geo.isp || null;
      }
    } catch (geoError) {
      console.log("IP GEO LOOKUP ERROR", geoError.message);
    }
    // =====================================
    // ✅ CREATE ANALYTICS
    // =====================================
    const analytics = await MovieDetailsAnalyticsModel.create(
      {
        movieId,
        userId: req.user?.id || null,
        sessionId,
        visitorId,
        ipAddress,
        country,
        state,
        city,
        countryCode,
        regionCode,
        latitude,
        longitude,
        isp,
        browser,
        os,
        deviceType,
        userAgent,
        eventType: "DETAILS_VIEW",
        sessionStartAt: new Date(),
        viewCountedAt: new Date(),
        lastSeenAt: new Date(),
        isLoggedIn: !!req.user,
      },
      {
        transaction,
      },
    );
    await transaction.commit();
    return res.status(201).json({
      success: true,
      analyticsId: analytics.id,
      message: "Movie session started successfully",
    });
  } catch (error) {
    await transaction.rollback();

    console.log("START MOVIE SESSION ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start movie session",
      error: error.message,
    });
  }
};

exports.endMovieSession = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { analyticsId } = req.body;

    // ==========================================
    // ✅ VALIDATION
    // ==========================================

    if (!analyticsId?.trim()) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Analytics ID is required",
      });
    }
    // ==========================================
    // ✅ FIND SESSION
    // ==========================================
    const analytics = await MovieDetailsAnalyticsModel.findByPk(analyticsId, {
      transaction,
    });
    if (!analytics) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Movie session not found",
      });
    }
    // ==========================================
    // ✅ SESSION ALREADY CLOSED
    // ==========================================
    if (analytics.sessionEndAt) {
      await transaction.rollback();

      return res.status(200).json({
        success: true,
        alreadyEnded: true,
        message: "Session already ended",
        timeSpent: analytics.timeSpent || 0,
      });
    }
    // ==========================================
    // ✅ CALCULATE TIME SPENT
    // ==========================================
    const endTime = new Date();
    const sessionStartAt = analytics.sessionStartAt || analytics.createdAt;
    let timeSpend = Math.floor((endTime - new Date(sessionStartAt)) / 1000);
    // Negative prevent
    timeSpent = Math.max(0, timeSpent);
    // Optional max cap (24 hours)
    timeSpent = Math.min(timeSpent, 86400);
    // ==========================================
    // ✅ UPDATE SESSION
    // ==========================================
    await analytics.update(
      {
        sessionEndAt: endTime,
        lastSeenAt: endTime,
        timeSpent,
      },
      {
        transaction,
      },
    );
    await transaction.commit();
    return res.status(200).json({
      success: true,
      analyticsId: analytics.id,
      timeSpent,
      sessionStartAt,
      sessionEndAt: endTime,

      message: "Movie session ended successfully",
    });
  } catch (error) {
    await transaction.rollback();

    console.log("END MOVIE SESSION ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to end movie session",
      error: error.message,
    });
  }
};

exports.getMovieAnalytics = async (req, res) => {
  try {
    const { movieId } = req.params;
    // =====================================
    // ✅ VALIDATION
    // =====================================
    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required",
      });
    }
    // =====================================
    // ✅ PARALLEL QUERIES
    // =====================================
    const [totalViews, uniqueVisitors, loggedUsers, avgTime] =
      await Promise.all([
        // Total Views

        MovieDetailsAnalyticsModel.count({
          where: {
            movieId,
            eventType: "DETAILS_VIEW",
          },
        }),
        // Unique Visitors
        MovieDetailsAnalyticsModel.count({
          distinct: true,
          col: "visitorId",
          where: {
            movieId,
          },
        }),
        // Logged Users
        MovieDetailsAnalyticsModel.count({
          distinct: true,
          col: "userId",
          where: {
            movieId,
            isLoggedIn: true,
          },
        }),
        // Average Time
        MovieDetailsAnalyticsModel.findOne({
          attributes: [[fn("AVG", col("timeSpent")), "averageTimeSpent"]],
          where: {
            movieId,
          },
          raw: true,
        }),
      ]);
    // =====================================
    // ✅ RESPONSE
    // =====================================
    return res.status(200).json({
      success: true,

      data: {
        movieId,

        totalViews,

        uniqueVisitors,

        loggedUsers,

        guestUsers: uniqueVisitors - loggedUsers,

        averageTimeSpent: Math.round(Number(avgTime?.averageTimeSpent || 0)),
      },
    });
  } catch (error) {
    console.log("GET MOVIE ANALYTICS ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};
