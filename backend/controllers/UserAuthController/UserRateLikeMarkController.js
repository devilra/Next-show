const sequelize = require("../../config/db");
const MarkWatchedMovieModel = require("../../models/UserAuth/MarkWatched");
const UserMovieRatingModel = require("../../models/UserAuth/UserMovieRating");
const UserRecentViewModel = require("../../models/UserAuth/UserRecentView");
const UserWatchlistModel = require("../../models/UserAuth/UserWatchlistModel");

exports.toggleMarkWatched = async (req, res) => {
  // ======================================================
  // ✅ TRANSACTION
  // ======================================================
  const transaction = await sequelize.transaction();

  try {
    // ======================================================
    // ✅ GET USER
    // ======================================================
    const userId = req.user.id;

    // ======================================================
    // ✅ GET MOVIE ID
    // ======================================================
    const { movieId } = req.body;

    // ======================================================
    // ✅ VALIDATION
    // ======================================================
    if (!movieId) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,

        message: "Movie ID is required",
      });
    }
    // ======================================================
    // ✅ CHECK EXISTING WATCHED
    // ======================================================
    const existingWatchedMovie = await MarkWatchedMovieModel.findOne({
      where: {
        userId,
        movieId,
      },
      transaction,
    });

    // ======================================================
    // ✅ IF ALREADY WATCHED
    // REMOVE WATCHED
    // ======================================================

    if (existingWatchedMovie) {
      await existingWatchedMovie.destroy({
        transaction,
      });

      // ==================================================
      // ✅ COMMIT
      // ==================================================

      await transaction.commit();

      return res.status(200).json({
        success: true,

        watched: false,

        message: "Removed from watched list",
      });
    }
    // ======================================================
    // ✅ CREATE WATCHED MOVIE
    // ======================================================
    await MarkWatchedMovieModel.create(
      {
        userId,

        movieId,

        watchedAt: new Date(),
      },
      {
        transaction,
      },
    );
    // ======================================================
    // ✅ COMMIT
    // ======================================================
    await transaction.commit();
    return res.status(200).json({
      success: true,

      watched: true,

      message: "Marked as watched",
    });
  } catch (error) {
    // ======================================================
    // ✅ ROLLBACK
    // ======================================================
    await transaction.rollback();
    console.log("TOGGLE MARK WATCHED ERROR", error);
    return res.status(500).json({
      success: false,

      message: "Failed to update watched status",

      error: error.message,
    });
  }
};

// ======================================================
// ✅ CHECK MARK WATCHED STATUS
// ======================================================
exports.checkMarkWatchedStatus = async (req, res) => {
  try {
    // ======================================================
    // ✅ GET USER
    // ======================================================
    const userId = req.user.id;
    // console.log("User Id", userId);
    // ======================================================
    // ✅ GET MOVIE ID
    // ======================================================
    const { movieId } = req.params;
    // console.log("MovieID", movieId);
    // ======================================================
    // ✅ VALIDATION
    // ======================================================
    if (!movieId) {
      return res.status(400).json({
        success: false,

        message: "Movie ID is required",
      });
    }

    // ======================================================
    // ✅ CHECK WATCHED
    // ======================================================
    const existingWatchedMovie = await MarkWatchedMovieModel.findOne({
      where: {
        userId,
        movieId,
      },
    });

    return res.status(200).json({
      success: true,

      watched: !!existingWatchedMovie,
    });
  } catch (error) {
    console.log("CHECK WATCHED STATUS ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to check watched status",

      error: error.message,
    });
  }
};

// ======================================================
// ✅ ADD OR UPDATE MOVIE RATING
// ======================================================
exports.addOrUpdateMovieRating = async (req, res) => {
  console.log("Rating", req.body);
  // ======================================================
  // ✅ TRANSACTION
  // ======================================================
  const transaction = await sequelize.transaction();
  try {
    // ======================================================
    // ✅ GET USER
    // ======================================================
    const userId = req.user.id;
    // ======================================================
    // ✅ GET BODY
    // ======================================================
    const { movieId, rating, review } = req.body;
    // ======================================================
    // ✅ VALIDATION
    // ======================================================
    if (!movieId) {
      await transaction.rollback();

      console.log("Movie id require", movieId);
      return res.status(405).json({
        success: false,

        message: "Movie ID is required",
      });
    }
    // ======================================================
    // ✅ VALIDATE RATING
    // ======================================================
    if (!rating) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,

        message: "Rating is required",
      });
    }
    // ======================================================
    // ✅ VALIDATE RANGE
    // ======================================================
    if (rating < 1 || rating > 10) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 10",
      });
    }

    // ======================================================
    // ✅ CHECK EXISTING RATING
    // ======================================================
    const existingRating = await UserMovieRatingModel.findOne({
      where: {
        userId,
        movieId,
      },
      transaction,
    });

    // ======================================================
    // ✅ UPDATE EXISTING
    // ======================================================
    if (existingRating) {
      await existingRating.update(
        {
          rating,
          review: review || null,
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
        isUpdated: true,
        message: "Rating updated successfully",
        data: existingRating,
      });
    }

    // ======================================================
    // ✅ CREATE NEW RATING
    // ======================================================
    const newRating = await UserMovieRatingModel.create(
      {
        userId,
        movieId,
        rating,
        review: review || null,
      },
      {
        transaction,
      },
    );

    // ======================================================
    // ✅ COMMIT
    // ======================================================
    await transaction.commit();
    return res.status(201).json({
      success: true,
      isUpdated: false,
      message: "Rating added successfully",
      data: newRating,
    });
  } catch (error) {
    // ======================================================
    // ✅ ROLLBACK
    // ======================================================
    await transaction.rollback();
    console.log("ADD OR UPDATE MOVIE RATING ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save rating",
      error: error.message,
    });
  }
};

// ======================================================
// ✅ GET USER MOVIE RATING
// ======================================================
exports.getUserMovieRating = async (req, res) => {
  try {
    // ======================================================
    // ✅ GET USER
    // ======================================================
    const userId = req.user.id;

    // ======================================================
    // ✅ GET MOVIE ID
    // ======================================================
    const { movieId } = req.params;
    // ======================================================
    // ✅ VALIDATION
    // ======================================================
    if (!movieId) {
      return res.status(400).json({
        success: false,

        message: "Movie ID is required",
      });
    }
    // ======================================================
    // ✅ FIND RATING
    // ======================================================
    const existingRating = await UserMovieRatingModel.findOne({
      where: {
        userId,
        movieId,
      },
    });

    return res.status(200).json({
      success: true,

      rated: !!existingRating,

      data: existingRating || null,
    });
  } catch (error) {
    console.log("GET USER MOVIE RATING ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch movie rating",
      error: error.message,
    });
  }
};

// ======================================================
// ✅ DELETE MOVIE RATING
// ======================================================
exports.deleteMovieRating = async (req, res) => {
  // ======================================================
  // ✅ TRANSACTION
  // ======================================================
  const transaction = await sequelize.transaction();

  try {
    // ======================================================
    // ✅ GET USER
    // ======================================================
    const userId = req.user.id;

    // ======================================================
    // ✅ GET MOVIE ID
    // ======================================================
    const { movieId } = req.params;

    // ======================================================
    // ✅ FIND EXISTING
    // ======================================================
    const existingRating = await UserMovieRatingModel.findOne({
      where: {
        userId,
        movieId,
      },

      transaction,
    });
    // ======================================================
    // ✅ NOT FOUND
    // ======================================================
    if (!existingRating) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }
    // ======================================================
    // ✅ DELETE
    // ======================================================
    await existingRating.destroy({
      transaction,
    });

    // ======================================================
    // ✅ COMMIT
    // ======================================================
    await transaction.commit();
    return res.status(200).json({
      success: true,
      message: "Rating removed successfully",
    });
  } catch (error) {
    // ======================================================
    // ✅ ROLLBACK
    // ======================================================

    await transaction.rollback();

    console.log("DELETE MOVIE RATING ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to delete rating",

      error: error.message,
    });
  }
};

// ======================================================
// ✅ ADD RECENT VIEW
// ======================================================
exports.addRecentView = async (req, res) => {
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
    // ✅ GET BODY
    // ==================================================
    const { contentType, contentId } = req.body;
    // ==================================================
    // ✅ VALIDATION
    // ==================================================
    if (!contentType || !contentId) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,

        message: "Content type and content ID are required",
      });
    }
    // ==================================================
    // ✅ VALID CONTENT TYPES
    // ==================================================
    const validContentTypes = ["MOVIE", "NEWS", "WEBSERIES", "TRAILER"];
    // ==================================================
    // ✅ INVALID CONTENT TYPE
    // ==================================================
    if (!validContentTypes.includes(contentType)) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,

        message: "Invalid content type",
      });
    }
    // ==================================================
    // ✅ CHECK EXISTING VIEW
    // ==================================================
    const existingView = await UserRecentViewModel.findOne({
      where: {
        userId,
        contentType,
        contentId,
      },
      transaction,
    });
    // ==================================================
    // ✅ IF EXISTS
    // UPDATE VIEWED TIME
    // ==================================================
    if (existingView) {
      existingView.viewedAt = new Date();
      await existingView.save({
        transaction,
      });
      // ================================================
      // ✅ COMMIT
      // ================================================
      await transaction.commit();
      return res.status(200).json({
        success: true,

        recentlyViewed: true,

        message: "Recent view updated successfully",

        data: existingView,
      });
    }
    // ==================================================
    // ✅ CREATE NEW RECENT VIEW
    // ==================================================
    const recentView = await UserRecentViewModel.create(
      {
        userId,
        contentType,
        contentId,
        viewedAt: new Date(),
      },
      {
        transaction,
      },
    );
    // ==================================================
    // ✅ COMMIT
    // ==================================================
    await transaction.commit();
    return res.status(201).json({
      success: true,
      recentlyViewed: true,
      message: "Added to recently viewed",
      data: recentView,
    });
  } catch (error) {
    // ==================================================
    // ✅ ROLLBACK
    // ==================================================
    await transaction.rollback();

    console.log("ADD RECENT VIEW ERROR", error);
    return res.status(500).json({
      success: false,

      message: "Failed to add recent view",

      error: error.message,
    });
  }
};

// ======================================================
// ✅ GET RECENT VIEWS
// ======================================================
exports.getRecentViews = async (req, res) => {
  try {
    // ==================================================
    // ✅ GET USER
    // ==================================================
    const userId = req.user.id;
    // ==================================================
    // ✅ QUERY PARAMS
    // ==================================================
    const { contentType, limit = 10 } = req.query;
    // ==================================================
    // ✅ WHERE CONDITION
    // ==================================================
    const whereCondition = {
      userId,
    };
    // ==================================================
    // ✅ FILTER CONTENT TYPE
    // ==================================================
    if (contentType) {
      whereCondition.contentType = contentType;
    }
    // ==================================================
    // ✅ GET RECENT VIEWS
    // ==================================================
    const recentViews = await UserRecentViewModel.findAll({
      where: whereCondition,
      order: [["viewedAt", "DESC"]],
      limit: Number(limit),
    });
    return res.status(200).json({
      success: true,
      count: recentViews.length,
      data: recentViews,
    });
  } catch (error) {
    console.log("GET RECENT VIEWS ERROR", error);
    return res.status(500).json({
      success: false,

      message: "Failed to fetch recent views",

      error: error.message,
    });
  }
};

// ======================================================
// ✅ CLEAR SINGLE RECENT VIEW
// ======================================================
exports.removeRecentView = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // ==================================================
    // ✅ GET USER
    // ==================================================
    const userId = req.user.id;
    // ==================================================
    // ✅ GET PARAMS
    // ==================================================
    const { recentViewId } = req.params;
    // ==================================================
    // ✅ FIND RECENT VIEW
    // ==================================================
    const recentView = await UserRecentViewModel.findOne({
      where: {
        id: recentViewId,
        userId,
      },
      transaction,
    });

    // ==================================================
    // ✅ NOT FOUND
    // ==================================================
    if (!recentView) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,

        message: "Recent view not found",
      });
    }
    // ==================================================
    // ✅ DELETE
    // ==================================================
    await recentView.destroy({ transaction });
    // ==================================================
    // ✅ COMMIT
    // ==================================================
    await transaction.commit();
    return res.status(200).json({
      success: true,

      message: "Recent view removed successfully",
    });
  } catch (error) {
    // ==================================================
    // ✅ ROLLBACK
    // ==================================================
    await transaction.rollback();
    console.log("REMOVE RECENT VIEW ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to remove recent view",

      error: error.message,
    });
  }
};

// ======================================================
// ✅ CLEAR ALL RECENT VIEWS
// ======================================================
exports.clearAllRecentViews = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // ==================================================
    // ✅ GET USER
    // ==================================================
    const userId = req.user.id;
    // ==================================================
    // ✅ DELETE ALL
    // ==================================================
    await UserRecentViewModel.destroy({
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

      message: "All recent views cleared successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.log("CLEAR ALL RECENT VIEWS ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to clear recent views",

      error: error.message,
    });
  }
};

// ======================================================
// ✅ TOGGLE WATCHLIST
// ======================================================

exports.toggleWatchlist = async (req, res) => {
  // ======================================================
  // ✅ TRANSACTION
  // ======================================================
  const transaction = await sequelize.transaction();
  try {
    // ======================================================
    // ✅ GET USER
    // ======================================================
    const userId = req.user.id;
    // ======================================================
    // ✅ GET MOVIE ID
    // ======================================================
    const { movieId } = req.body;
    // ======================================================
    // ✅ VALIDATION
    // ======================================================

    if (!movieId) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,

        message: "Movie ID is required",
      });
    }
    // ======================================================
    // ✅ CHECK EXISTING WATCHLIST
    // ======================================================
    const existingWatchlist = await UserWatchlistModel.findOne({
      where: {
        userId,
        movieId,
      },
      transaction,
    });

    // ======================================================
    // ✅ REMOVE FROM WATCHLIST
    // ======================================================
    if (existingWatchlist) {
      await existingWatchlist.destroy({ transaction });

      await transaction.commit();

      return res.status(200).json({
        success: true,

        added: false,

        message: "Removed from watchlist",
      });
    }

    // ======================================================
    // ✅ CREATE WATCHLIST
    // ======================================================
    await UserWatchlistModel.create(
      {
        userId,
        movieId,
      },
      {
        transaction,
      },
    );
    await transaction.commit();
    return res.status(200).json({
      success: true,

      added: true,

      message: "Added to watchlist",
    });
  } catch (error) {
    // ======================================================
    // ✅ ROLLBACK
    // ======================================================
    await transaction.rollback();

    console.log("TOGGLE WATCHLIST ERROR", error);
    return res.status(500).json({
      success: false,

      message: "Failed to update watchlist",

      error: error.message,
    });
  }
};
// ======================================================
// ✅ CHECK WATCHLIST STATUS
// ======================================================
exports.checkWatchlistStatus = async (req, res) => {
  try {
    // ======================================================
    // ✅ GET USER
    // ======================================================

    const userId = req.user.id;
    // ======================================================
    // ✅ GET MOVIE ID
    // ======================================================

    const { movieId } = req.params;
    // ======================================================
    // ✅ VALIDATION
    // ======================================================

    // console.log("MovieId", movieId);

    if (!movieId) {
      return res.status(400).json({
        success: false,

        message: "Movie ID is required",
      });
    }
    // ======================================================
    // ✅ FIND WATCHLIST
    // ======================================================

    // console.log("UserId", userId);

    const existingWatchlist = await UserWatchlistModel.findOne({
      where: {
        userId,
        movieId,
      },
    });

    return res.status(200).json({
      success: true,
      inWatchlist: !!existingWatchlist,
    });
  } catch (error) {
    console.log("CHECK WATCHLIST STATUS ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to check watchlist status",

      error: error.message,
    });
  }
};
// ======================================================
// ✅ GET USER WATCHLIST
// ======================================================
exports.getUserWatchlist = async (req, res) => {
  try {
    // ======================================================
    // ✅ GET USER
    // ======================================================

    const userId = req.user.id;
    // ======================================================
    // ✅ GET LIMIT
    // ======================================================
    const limit = Number(req.query.limit) || 20;
    // ======================================================
    // ✅ FIND WATCHLIST
    // ======================================================
    const watchlist = await UserWatchlistModel.findAll({
      where: {
        userId,
      },
      order: [["createdAt", "DESC"]],
      limit,
    });
    return res.status(200).json({
      success: true,
      count: watchlist.length,
      data: watchlist,
    });
  } catch (error) {
    console.log("GET USER WATCHLIST ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch watchlist",
      error: error.message,
    });
  }
};
// ======================================================
// ✅ REMOVE SINGLE WATCHLIST
// ======================================================
exports.removeWatchlistItem = async (req, res) => {
  // ======================================================
  // ✅ TRANSACTION
  // ======================================================
  const transaction = await sequelize.transaction();
  try {
    // ======================================================
    // ✅ GET USER
    // ======================================================

    const userId = req.user.id;
    // ======================================================
    // ✅ GET WATCHLIST ID
    // ======================================================
    const { watchlistId } = req.params;
    // ======================================================
    // ✅ FIND ITEM
    // ======================================================
    const watchlistItem = await UserWatchlistModel.findOne({
      where: {
        id: watchlistId,
        userId,
      },
      transaction,
    });
    // ======================================================
    // ✅ NOT FOUND
    // ======================================================
    if (!watchlistItem) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,

        message: "Watchlist item not found",
      });
    }
    // ======================================================
    // ✅ DELETE
    // ======================================================
    await watchlistItem.destroy({ transaction });
    // ======================================================
    // ✅ COMMIT
    // ======================================================

    await transaction.commit();
    return res.status(200).json({
      success: true,

      message: "Removed from watchlist successfully",
    });
  } catch (error) {
    // ======================================================
    // ✅ ROLLBACK
    // ======================================================

    await transaction.rollback();

    console.log("REMOVE WATCHLIST ITEM ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to remove watchlist item",

      error: error.message,
    });
  }
};
// ======================================================
// ✅ CLEAR ALL WATCHLIST
// ======================================================
exports.clearAllWatchlist = async (req, res) => {
  // ======================================================
  // ✅ TRANSACTION
  // ======================================================

  const transaction = await sequelize.transaction();
  try {
    // ======================================================
    // ✅ GET USER
    // ======================================================

    const userId = req.user.id;
    // ======================================================
    // ✅ DELETE ALL
    // ======================================================
    await UserWatchlistModel.destroy({
      where: {
        userId,
      },
      transaction,
    });
    // ======================================================
    // ✅ COMMIT
    // ======================================================

    await transaction.commit();

    return res.status(200).json({
      success: true,

      message: "All watchlist cleared successfully",
    });
  } catch (error) {
    await transaction.rollback();

    console.log("CLEAR WATCHLIST ERROR", error);

    return res.status(500).json({
      success: false,

      message: "Failed to clear watchlist",

      error: error.message,
    });
  }
};
