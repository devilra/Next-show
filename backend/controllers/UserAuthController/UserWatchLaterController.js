const sequelize = require("../../config/db");
const CentralizedNewsModel = require("../../models/CentralizedNewsModels/CentralizedNewsModel");
const UserNewsLikeModel = require("../../models/UserAuth/UserNewsLikeModel");
const UserWatchLaterModel = require("../../models/UserAuth/UserWatchLater");
const moment = require("moment");

// ======================================================
// ✅ SAFE JSON PARSER
// ======================================================

const parseField = (value, defaultValue = []) => {
  try {
    if (!value) {
      return defaultValue;
    }

    if (Array.isArray(value)) {
      return value;
    }

    return JSON.parse(value);
  } catch (error) {
    return defaultValue;
  }
};

exports.toggleWatchLater = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    // ==================================================
    // ✅ GET BODY
    // ==================================================
    const { newsId, reminderDate } = req.body;
    // ==================================================
    // ✅ VALIDATION
    // ==================================================
    if (!newsId) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,

        message: "News ID is required",
      });
    }
    // ==================================================
    // ✅ CHECK EXISTING
    // ==================================================
    const existingWatchLater = await UserWatchLaterModel.findOne({
      where: {
        userId,
        newsId,
      },
      transaction,
    });

    // ==================================================
    // ✅ REMOVE
    // ==================================================
    if (existingWatchLater) {
      await existingWatchLater.destroy({ transaction });
      // ================================================
      // ✅ COMMIT
      // ================================================
      await transaction.commit();
      return res.status(200).json({
        success: true,

        added: false,

        message: "Removed from watch later",
      });
    }
    // ==================================================
    // ✅ CREATE
    // ==================================================
    await UserWatchLaterModel.create(
      {
        userId,
        newsId,
        reminderDate: reminderDate || null,
      },
      {
        transaction,
      },
    );
    // ==================================================
    // ✅ COMMIT
    // ==================================================
    await transaction.commit();

    return res.status(200).json({
      success: true,

      added: true,

      message: "Added to watch later",
    });
  } catch (error) {
    // ==================================================
    // ✅ ROLLBACK
    // ==================================================
    await transaction.rollback();
    console.log("TOGGLE WATCH LATER ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to update watch later",

      error: error.message,
    });
  }
};

// ======================================================
// ✅ CHECK WATCH LATER STATUS
// ======================================================

exports.checkWatchLaterStatus = async (req, res) => {
  try {
    // ==================================================
    // ✅ GET USER
    // ==================================================
    const userId = req.user.id;
    // ==================================================
    // ✅ GET NEWS ID
    // ==================================================
    const { newsId } = req.params;
    // ==================================================
    // ✅ VALIDATION
    // ==================================================
    if (!newsId) {
      return res.status(400).json({
        success: false,

        message: "News ID is required",
      });
    }

    // ==================================================
    // ✅ FIND
    // ==================================================
    const existingWatchLater = await UserWatchLaterModel.findOne({
      where: {
        userId,
        newsId,
      },
    });

    return res.status(200).json({
      success: true,

      inWatchLater: !!existingWatchLater,
    });
  } catch (error) {
    console.log("CHECK WATCH LATER STATUS ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to check watch later status",

      error: error.message,
    });
  }
};

// ======================================================
// ✅ GET USER WATCH LATER
// ======================================================
exports.getUserWatchLater = async (req, res) => {
  try {
    // ================================================
    // ✅ GET USER
    // ================================================
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // ================================================
    // ✅ LIMIT
    // ================================================
    const limit = Number(req.query.limit) || 20;
    // ================================================
    // ✅ GET DATA
    // ================================================
    const watchLaterList = await UserWatchLaterModel.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: CentralizedNewsModel,
          as: "news",
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    });

    // ================================================
    // ✅ FORMAT RESPONSE
    // ================================================
    const formattedData = watchLaterList.map((item) => {
      const news = item.news;
      return {
        id: item.id,
        createdAt: item.createdAt,
        news: news
          ? {
              id: news.id,
              title: news.title,
              slug: news.slug,
              shortDescription: news.shortDescription,
              authorName: news.authorName,
              readTime: news.readTime,
              viewCount: news.viewCount,
              isTrending: news.isTrending,
              // ========================================
              // ✅ IMAGE ARRAY
              // ========================================
              newsImages: parseField(news.newsImages, []),
              // ========================================
              // ✅ VIDEO ARRAY
              // ========================================
              videoUrl: parseField(news.videoUrl, []),
              // ========================================
              // ✅ CATEGORY ARRAY
              // ========================================

              categories: parseField(news.categories, []),
              newsTypes: parseField(news.newsTypes, []),
              tags: parseField(news.tags, []),
              publishedDate: news.publishedAt
                ? moment(news.publishedAt).format("MMMM DD YYYY")
                : null,
            }
          : null,
      };
    });

    return res.status(200).json({
      success: true,

      count: formattedData.length,

      data: formattedData,
    });
  } catch (error) {
    console.log("GET WATCH LATER ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch watch later",

      error: error.message,
    });
  }
};

// ======================================================
// ✅ REMOVE SINGLE WATCH LATER
// ======================================================
exports.removeWatchLaterItem = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { watchLaterId } = req.params;
    const watchLaterItem = await UserWatchLaterModel.findOne({
      where: {
        id: watchLaterId,
        userId,
      },
      transaction,
    });
    // ================================================
    // ✅ NOT FOUND
    // ================================================
    if (!watchLaterItem) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,

        message: "Watch later item not found",
      });
    }
    // ================================================
    // ✅ DELETE
    // ================================================
    await watchLaterItem.destroy({ transaction });
    // ================================================
    // ✅ COMMIT
    // ================================================

    await transaction.commit();
    return res.status(200).json({
      success: true,

      message: "Removed from watch later",
    });
  } catch (error) {
    await transaction.rollback();

    console.log("REMOVE WATCH LATER ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to remove watch later",

      error: error.message,
    });
  }
};

exports.clearAllWatchLater = async (req, res) => {
  // ====================================================
  // ✅ TRANSACTION
  // ====================================================

  const transaction = await sequelize.transaction();

  try {
    // ==================================================
    // ✅ GET USER
    // ==================================================

    const userId = req.user.id;

    // ==================================================
    // ✅ CHECK EXISTING DATA
    // ==================================================

    const existingWatchLater = await UserWatchLaterModel.count({
      where: {
        userId,
      },

      transaction,
    });

    // ==================================================
    // ✅ ALREADY EMPTY
    // ==================================================

    if (existingWatchLater === 0) {
      await transaction.rollback();

      return res.status(200).json({
        success: true,

        alreadyCleared: true,

        message: "Watch later already empty",
      });
    }

    // ==================================================
    // ✅ DELETE ALL
    // ==================================================

    await UserWatchLaterModel.destroy({
      where: {
        userId,
      },

      transaction,
    });

    // ==================================================
    // ✅ COMMIT
    // ==================================================

    await transaction.commit();

    return res.status(200).json({
      success: true,

      cleared: true,

      message: "All watch later cleared successfully",
    });
  } catch (error) {
    // ==================================================
    // ✅ ROLLBACK
    // ==================================================

    await transaction.rollback();

    console.log("CLEAR WATCH LATER ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to clear watch later",

      error: error.message,
    });
  }
};

exports.toggleNewsLike = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { newsId } = req.body;
    if (!newsId) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "News ID is required",
      });
    }
    const existingLike = await UserNewsLikeModel.findOne({
      where: {
        userId,
        newsId,
      },
      transaction,
    });
    // ======================================
    // REMOVE LIKE
    // ======================================
    if (existingLike) {
      await existingLike.destroy({
        transaction,
      });

      await transaction.commit();

      return res.status(200).json({
        success: true,
        liked: false,
        message: "Like removed",
      });
    }
    // ======================================
    // CREATE LIKE
    // ======================================
    await UserNewsLikeModel.create(
      {
        userId,
        newsId,
      },
      {
        transaction,
      },
    );
    await transaction.commit();

    return res.status(200).json({
      success: true,
      liked: true,
      message: "News liked",
    });
  } catch (error) {
    await transaction.rollback();

    console.log("TOGGLE NEWS LIKE ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update like",
      error: error.message,
    });
  }
};

exports.checkNewsLikeStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const { newsId } = req.params;

    const existingLike = await UserNewsLikeModel.findOne({
      where: {
        userId,
        newsId,
      },
    });

    return res.status(200).json({
      success: true,
      liked: !!existingLike,
    });
  } catch (error) {
    console.log("CHECK NEWS LIKE ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to check like status",
      error: error.message,
    });
  }
};

exports.getNewsLikeCount = async (req, res) => {
  try {
    const { newsId } = req.params;

    const count = await UserNewsLikeModel.count({
      where: {
        newsId,
      },
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.log("GET NEWS LIKE COUNT ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch like count",
      error: error.message,
    });
  }
};
exports.getUserLikedNews = async (req, res) => {
  try {
    const userId = req.user.id;

    const likes = await UserNewsLikeModel.findAll({
      where: {
        userId,
      },

      include: [
        {
          model: CentralizedNewsModel,
          as: "news",
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: likes.length,
      data: likes,
    });
  } catch (error) {
    console.log("GET USER LIKED NEWS ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch liked news",
      error: error.message,
    });
  }
};
