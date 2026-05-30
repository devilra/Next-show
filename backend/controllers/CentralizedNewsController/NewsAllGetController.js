const moment = require("moment");
const { Op } = require("sequelize");
const CentralizedNewsModel = require("../../models/CentralizedNewsModels/CentralizedNewsModel");
const UserWatchLaterModel = require("../../models/UserAuth/UserWatchLater");

// ======================================================
// ✅ JSON PARSE HELPER
// ======================================================

const parseJSONField = (field, fallback = []) => {
  try {
    if (!field) return fallback;
    // already parsed

    if (typeof field === "object") {
      return field;
    }
    return JSON.parse(field);
  } catch (error) {
    return fallback;
  }
};

// ======================================================
// ✅ FORMAT DATE
// ======================================================

const formatDate = (date) => {
  if (!date) return "";

  return moment(date).format("MMM DD, YYYY");
};

// ======================================================
// ✅ GET LATEST NEWS
// ======================================================

exports.getLatestNews = async (req, res) => {
  // ======================================================
  // ✅ GET LATEST NEWS
  // LAST 7 DAYS ONLY
  // DESC ORDER
  // NO LIMIT
  // ======================================================

  try {
    // ======================================================
    // ✅ CURRENT USER
    // ======================================================

    const userId = req.user?.id;

    const startDate = moment().subtract(7, "days").startOf("day").toDate();

    const endDate = moment().endOf("day").toDate();

    // ======================================================
    // ✅ GET LATEST NEWS
    // ======================================================
    const latestNews = await CentralizedNewsModel.findAll({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        "id",
        "title",
        "slug",
        "shortDescription",
        "newsImages",
        "categories",
        "newsTypes",
        "tags",
        "viewCount",
        "readTime",
        "isTrending",
        "publishedAt",
        "createdAt",
        "authorName",
      ],
      // ✅ NEWEST FIRST
      order: [["publishedAt", "DESC"]],
    });

    // ======================================================
    // ✅ EMPTY NEWS CHECK
    // ======================================================

    if (!latestNews || latestNews.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No latest news found.",
        totalNews: 0,
        data: [],
      });
    }

    // ======================================================
    // ✅ NEWS IDS
    // ======================================================

    const newsIds = latestNews.map((news) => news.id);

    // ======================================================
    // ✅ WATCH LATER DATA
    // ======================================================

    const watchLaterRecords = userId
      ? await UserWatchLaterModel.findAll({
          where: {
            userId,

            newsId: newsIds,
          },

          attributes: ["newsId"],
        })
      : [];

    // ======================================================
    // ✅ FAST LOOKUP
    // ======================================================

    const watchLaterIds = new Set(watchLaterRecords.map((item) => item.newsId));

    const parsedNews = latestNews.map((news) => ({
      ...news.toJSON(),
      newsImages: parseJSONField(news.newsImages, []),
      categories: parseJSONField(news.categories, []),
      newsTypes: parseJSONField(news.newsTypes, []),
      tags: parseJSONField(news.tags, []),
      formattedDate: moment(news.publishedAt).format("MMM D, YYYY"),
      // ================================================
      // ✅ WATCH LATER STATUS
      // ================================================

      inWatchLater: watchLaterIds.has(news.id),
    }));

    // ======================================================
    // ✅ RESPONSE
    // ======================================================
    return res.status(200).json({
      success: true,

      totalNews: parsedNews.length,

      lastDays: 7,

      data: parsedNews,
    });

    const limit = Num;
  } catch (error) {
    console.log("GET LATEST NEWS ERROR:", error);

    // ======================================================
    // ✅ SEQUELIZE DB ERROR
    // ======================================================

    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({
        success: false,
        message: "Database error occurred while fetching latest news.",
        error: error.message,
      });
    }

    // ======================================================
    // ✅ SEQUELIZE VALIDATION ERROR
    // ======================================================

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
        errors: error.errors.map((err) => err.message),
      });
    }

    // ======================================================
    // ✅ GENERIC ERROR
    // ======================================================

    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest news.",
      error: error.message,
    });
  }
};

// ======================================================
// ✅ GET HERO TRENDING NEWS
// LAST 2 DAYS
// TRENDING PRIORITY
// LATEST FIRST
// ======================================================
exports.getHeroTrendingNews = async (req, res) => {
  try {
    // ======================================================
    // ✅ CURRENT USER
    // ======================================================
    const userId = req.user?.id;
    console.log(userId);

    const startDate = moment().subtract(2, "days").startOf("day").toDate();
    const endDate = moment().endOf("day").toDate();

    // ======================================================
    // ✅ FETCH HERO NEWS
    // ======================================================

    const heroNews = await CentralizedNewsModel.findAll({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          [Op.ne]: null,
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        "id",
        "title",
        "slug",
        "shortDescription",
        "longDescription",
        "newsImages",
        "videoUrl",
        "categories",
        "newsTypes",
        "tags",
        "viewCount",
        "readTime",
        "isTrending",
        "publishedAt",
        "createdAt",
        "authorName",
      ],
      order: [
        ["isTrending", "DESC"],
        ["publishedAt", "DESC"],
      ],
      // ======================================================
      // ✅ HERO SECTION LIMIT
      // ======================================================
      limit: 5,
    });

    // ======================================================
    // ✅ EMPTY CHECK
    // ======================================================
    if (!heroNews || heroNews.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No news found.",
        totalNews: 0,
        data: [],
      });
    }
    // ======================================================
    // ✅ HERO NEWS IDS
    // ======================================================
    const newsIds = heroNews.map((news) => news.id);

    const watchLaterRecords = userId
      ? await UserWatchLaterModel.findAll({
          where: {
            userId,
            newsId: newsIds,
          },
          attributes: ["newsId"],
        })
      : [];

    // ======================================================
    // ✅ FAST LOOKUP
    // ======================================================
    const watchLaterIds = new Set(watchLaterRecords.map((item) => item.newsId));

    // ======================================================
    // ✅ PARSE JSON FIELDS
    // ======================================================
    const parsedHeroNews = heroNews.map((news) => ({
      ...news.toJSON(),
      newsImages: parseJSONField(news.newsImages, []),
      videoUrl: parseJSONField(news.videoUrl, []),
      categories: parseJSONField(news.categories, []),
      newsTypes: parseJSONField(news.newsTypes, []),
      tags: parseJSONField(news.tags, []),
      formattedDate: moment(news.publishedAt).format("MMM D, YYYY"),
      // ====================================================
      // ✅ WATCH LATER STATUS
      // ====================================================
      isWatchLater: watchLaterIds.has(news.id),
    }));

    // ======================================================
    // ✅ RESPONSE
    // ======================================================
    return res.status(200).json({
      success: true,

      message: "News collected successfully.",

      totalNews: parsedHeroNews.length,

      lastDays: 2,

      data: parsedHeroNews,
    });
  } catch (error) {
    console.log("GET HERO TRENDING NEWS ERROR:", error);

    // ======================================================
    // ✅ DATABASE ERROR
    // ======================================================

    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({
        success: false,
        message: "Database error occurred while fetching hero news.",
        error: error.message,
      });
    }

    // ======================================================
    // ✅ VALIDATION ERROR
    // ======================================================

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
        errors: error.errors.map((err) => err.message),
      });
    }

    // ======================================================
    // ✅ GENERIC ERROR
    // ======================================================

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hero trending news.",
      error: error.message,
    });
  }
};

// ======================================================
// ✅ GET TRENDING NEWS
// LAST 10 DAYS
// TRENDING ONLY
// LATEST FIRST
// ======================================================

exports.getTrendingNews = async (req, res) => {
  try {
    const userId = req.user?.id;

    // ======================================================
    // ✅ LAST 10 DAYS DATE RANGE
    // ======================================================

    const startDate = moment().subtract(10, "days").startOf("day").toDate();

    const endDate = moment().endOf("day").toDate();

    // ======================================================
    // ✅ FETCH TRENDING NEWS
    // ======================================================

    const trendingNews = await CentralizedNewsModel.findAll({
      where: {
        status: "PUBLISHED",
        isTrending: true,
        publishedAt: {
          [Op.ne]: null,
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        "id",
        "title",
        "slug",
        "shortDescription",
        "longDescription",
        "newsImages",
        "videoUrl",
        "categories",
        "newsTypes",
        "tags",
        "viewCount",
        "readTime",
        "isTrending",
        "publishedAt",
        "createdAt",
        "authorName",
      ],
      // ======================================================
      // ✅ LATEST TRENDING FIRST
      // ======================================================
      order: [["publishedAt", "DESC"]],
      limit: 10,
    });

    // ======================================================
    // ✅ EMPTY CHECK
    // ======================================================
    if (!trendingNews || trendingNews.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No trending news found.",
        totalNews: 0,
        data: [],
      });
    }

    // ======================================================
    // ✅ NEWS IDS
    // ======================================================

    const newsIds = trendingNews.map((news) => news.id);

    // ======================================================
    // ✅ USER WATCH LATER
    // ======================================================

    const watchLaterRecords = userId
      ? await UserWatchLaterModel.findAll({
          where: {
            userId,

            newsId: newsIds,
          },

          attributes: ["newsId"],
        })
      : [];

    // ======================================================
    // ✅ FAST LOOKUP
    // ======================================================

    const watchLaterIds = new Set(watchLaterRecords.map((item) => item.newsId));

    // ======================================================
    // ✅ PARSE JSON FIELDS
    // ======================================================

    const parsedTrendingNews = trendingNews.map((news) => ({
      ...news.toJSON(),

      newsImages: parseJSONField(news.newsImages, []),

      videoUrl: parseJSONField(news.videoUrl, []),

      categories: parseJSONField(news.categories, []),

      newsTypes: parseJSONField(news.newsTypes, []),

      tags: parseJSONField(news.tags, []),
      formattedDate: moment(news.publishedAt).format("MMM D, YYYY"),
      inWatchLater: watchLaterIds.has(news.id),
    }));
    // ======================================================
    // ✅ RESPONSE
    // ======================================================
    return res.status(200).json({
      success: true,

      message: "Trending news fetched successfully.",

      totalNews: parsedTrendingNews.length,

      lastDays: 10,

      data: parsedTrendingNews,
    });
  } catch (error) {
    console.log("GET TRENDING NEWS ERROR:", error);
    // ======================================================
    // ✅ DATABASE ERROR
    // ======================================================

    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({
        success: false,
        message: "Database error occurred while fetching trending news.",
        error: error.message,
      });
    }

    // ======================================================
    // ✅ VALIDATION ERROR
    // ======================================================

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
        errors: error.errors.map((err) => err.message),
      });
    }

    // ======================================================
    // ✅ GENERIC ERROR
    // ======================================================

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trending news.",
      error: error.message,
    });
  }
};

// ======================================================
// ✅ GET RELATED NEWS
// ======================================================

exports.getRelatedNews = async (req, res) => {
  try {
    const userId = req.user?.id;
    // ======================================================
    // ✅ SLUG
    // ======================================================
    const { slug } = req.params;

    // console.log("Related Slug", slug);

    // ======================================================
    // ✅ SLUG CHECK
    // ======================================================
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "News slug is required.",
      });
    }
    // ======================================================
    // ✅ CURRENT NEWS
    // ======================================================
    const currentNews = await CentralizedNewsModel.findOne({
      where: {
        slug: slug,
        status: "PUBLISHED",
      },
    });

    // ======================================================
    // ✅ NEWS NOT FOUND
    // ======================================================

    if (!currentNews) {
      return res.status(404).json({
        success: false,
        message: "Current news not found.",
      });
    }

    // ======================================================
    // ✅ CURRENT NEWS DATA
    // ======================================================

    const currentCategories = parseJSONField(currentNews.categories, []);

    const currentTags = parseJSONField(currentNews.tags, []);

    // ======================================================
    // ✅ FETCH RELATED NEWS
    // ======================================================
    const relatedNews = await CentralizedNewsModel.findAll({
      where: {
        status: "PUBLISHED",
        // ==================================================
        // ✅ EXCLUDE CURRENT NEWS
        // ==================================================
        id: {
          [Op.ne]: currentNews.id,
        },
        // ==================================================
        // ✅ RELATED MATCH
        // ==================================================
        [Op.or]: [
          // ================================================
          // ✅ CATEGORY MATCH
          // ================================================
          ...currentCategories.map((category) => ({
            categories: {
              [Op.like]: `%${category}%`,
            },
          })),
          // ================================================
          // ✅ TAG MATCH
          // ================================================
          ...currentTags.map((tag) => ({
            tags: {
              [Op.like]: `%${tag}%`,
            },
          })),
        ],
      },
      attributes: [
        "id",
        "title",
        "slug",
        "shortDescription",
        "newsImages",
        "categories",
        "newsTypes",
        "tags",
        "viewCount",
        "readTime",
        "isTrending",
        "publishedAt",
        "createdAt",
        "authorName",
      ],
      // ==================================================
      // ✅ ORDER
      // Trending First
      // Latest First
      // ==================================================
      order: [
        ["isTrending", "DESC"],
        ["publishedAt", "DESC"],
      ],
      // ==================================================
      // ✅ LIMIT
      // ==================================================
      limit: 8,
    });

    // ======================================================
    // ✅ EMPTY RELATED NEWS
    // ======================================================
    if (!relatedNews || relatedNews.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No related news found.",
        totalNews: 0,
        data: [],
      });
    }

    // ======================================================
    // ✅ RELATED NEWS IDS
    // ======================================================

    const newsIds = relatedNews.map((news) => news.id);

    // ======================================================
    // ✅ USER WATCH LATER
    // ======================================================

    const watchLaterRecords = userId
      ? await UserWatchLaterModel.findAll({
          where: {
            userId,

            newsId: newsIds,
          },

          attributes: ["newsId"],
        })
      : [];

    // ======================================================
    // ✅ FAST LOOKUP
    // ======================================================

    const watchLaterIds = new Set(watchLaterRecords.map((item) => item.newsId));

    // ======================================================
    // ✅ PARSED RELATED NEWS
    // ======================================================

    const parsedRelatedNews = relatedNews.map((news) => ({
      ...news.toJSON(),

      newsImages: parseJSONField(news.newsImages, []),

      categories: parseJSONField(news.categories, []),

      newsTypes: parseJSONField(news.newsTypes, []),

      tags: parseJSONField(news.tags, []),

      formattedDate: formatDate(news.publishedAt),
      inWatchLater: watchLaterIds.has(news.id),
    }));
    // ======================================================
    // ✅ RESPONSE
    // ======================================================

    return res.status(200).json({
      success: true,

      message: "Related news fetched successfully.",

      totalNews: parsedRelatedNews.length,

      currentNewsSlug: slug,

      data: parsedRelatedNews,
    });
  } catch (error) {
    console.log("GET RELATED NEWS ERROR:", error);

    // ======================================================
    // ✅ DATABASE ERROR
    // ======================================================

    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({
        success: false,
        message: "Database error occurred while fetching related news.",
        error: error.message,
      });
    }

    // ======================================================
    // ✅ VALIDATION ERROR
    // ======================================================

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
        errors: error.errors.map((err) => err.message),
      });
    }

    // ======================================================
    // ✅ GENERIC ERROR
    // ======================================================

    return res.status(500).json({
      success: false,
      message: "Failed to fetch related news.",
      error: error.message,
    });
  }
};
