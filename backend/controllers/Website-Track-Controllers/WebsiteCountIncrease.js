const { Op } = require("sequelize");
const sequelize = require("../../config/db");
const SiteAnalytics = require("../../models/WebsiteTracking/SiteAnalytics");
const DailyStats = require("../../models/WebsiteTracking/DailyStats");

/**
 * Intha function website-ku vara traffic-ah track panni,
 * Daily totals (Total & Unique visitors) update pannum.
 */

exports.initializeSessionAndTrackTraffic = async (req, res) => {
  try {
    const { visitorId, sessionId } = req.body;
    const today = new Date().toISOString().split("T")[0];

    // 1. Previous visit count
    const lastVisitRecord = await SiteAnalytics.findOne({
      where: { visitorId },
      order: [["entryTime", "DESC"]],
    });

    const currentVisitCount = lastVisitRecord
      ? lastVisitRecord.visitCount + 1
      : 1;

    // ✅ 2. Avoid duplicate session insert
    const [sessionData, created] = await SiteAnalytics.findOrCreate({
      where: { sessionId },
      defaults: {
        ...req.body,
        visitCount: currentVisitCount,
        entryTime: new Date(),
      },
    });

    // 👉 Already existனா insert ஆகாது
    // 👉 created === false

    // 3. DailyStats
    const [dailyReport] = await DailyStats.findOrCreate({
      where: { date: today },
      defaults: {
        totalVisitors: 0,
        uniqueVisitors: 0,
        totalPageViews: 0,
      },
    });

    // 4. Total visitors increment
    if (created) {
      await dailyReport.increment("totalVisitors");
    }

    // 5. Unique visitor check
    const hasExistingVisitToday = await SiteAnalytics.findOne({
      where: {
        visitorId,
        entryTime: { [Op.startsWith]: today },
        sessionId: { [Op.ne]: sessionId },
      },
    });

    if (!hasExistingVisitToday && created) {
      await dailyReport.increment("uniqueVisitors");
    }

    return res.status(200).json({
      success: true,
      message: "Session tracked successfully",
      visitNumber: currentVisitCount,
    });
  } catch (error) {
    console.error("Analytics Tracking Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to process analytics data",
    });
  }
};

const formatNumber = (value) => Number(value || 0);

const sumStats = async (where = {}) => {
  const totals = await DailyStats.findOne({
    where,
    attributes: [
      [sequelize.fn("SUM", sequelize.col("totalVisitors")), "totalVisitors"],
      [sequelize.fn("SUM", sequelize.col("uniqueVisitors")), "uniqueVisitors"],
      [sequelize.fn("SUM", sequelize.col("totalPageViews")), "totalPageViews"],
    ],
    raw: true,
  });

  return {
    totalVisitors: formatNumber(totals.totalVisitors),
    uniqueVisitors: formatNumber(totals.uniqueVisitors),
    totalPageViews: formatNumber(totals.totalPageViews),
  };
};

exports.getTrafficSummary = async (req, res) => {
  try {
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    const weekStartDate = weekStart.toISOString().split("T")[0];

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStartDate = monthStart.toISOString().split("T")[0];

    const yearStart = new Date(today.getFullYear(), 0, 1);
    const yearStartDate = yearStart.toISOString().split("T")[0];

    const overall = await sumStats();
    const weekly = await sumStats({
      date: { [Op.between]: [weekStartDate, todayDate] },
    });
    const monthly = await sumStats({
      date: { [Op.between]: [monthStartDate, todayDate] },
    });
    const yearly = await sumStats({
      date: { [Op.between]: [yearStartDate, todayDate] },
    });

    const last30Days = await DailyStats.findAll({
      where: {
        date: {
          [Op.between]: [
            new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - 29,
            )
              .toISOString()
              .split("T")[0],
            todayDate,
          ],
        },
      },
      order: [["date", "ASC"]],
      attributes: ["date", "totalVisitors", "uniqueVisitors", "totalPageViews"],
      raw: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        overall,
        weekly,
        monthly,
        yearly,
        last30Days,
      },
    });
  } catch (error) {
    console.error("Traffic Summary Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch traffic summary",
    });
  }
};

exports.trackExit = async (req, res) => {
  console.log("Exit track call");
  try {
    const { sessionId } = req.body;
    const exitTime = new Date();

    // 1. Intha session-oda entry record-ah kandupidippom
    const sessionRecord = await SiteAnalytics.findOne({
      where: { sessionId },
    });

    if (sessionId) {
      // 2. Duration calculate pannuvom (Optional)
      const entryTime = new Date(sessionRecord.entryTime);
      const durationInSeconds = Math.floor((exitTime - entryTime) / 1000);

      // 3. Exit time matrum duration-ah update pannuvom
      await sessionRecord.update({
        exitTime: exitTime,
        sessionDuration: durationInSeconds,
      });
    }

    return res.status(200).send(); // Beacon API-ku response mukkiyam illa
  } catch (error) {
    console.error("Exit Tracking Error:", error);
    return res.status(500).send();
  }
};
