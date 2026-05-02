const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const DailyStats = sequelize.define("DailyStats", {
  date: {
    type: DataTypes.DATEONLY, // Format: 2026-04-26
    primaryKey: true,
  },
  totalVisitors: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  uniqueVisitors: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalPageViews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = DailyStats;
