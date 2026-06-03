const sequelize = require("../../config/db");
const { Movie } = require("../../models/associationIndex");
const MarkWatchedMovieModel = require("../../models/UserAuth/MarkWatched");
const UserAuthModel = require("../../models/UserAuth/UserAuth");
const UserMovieRatingModel = require("../../models/UserAuth/UserMovieRating");
const UserRecentViewModel = require("../../models/UserAuth/UserRecentView");
const UserReviewLikeModel = require("../../models/UserAuth/UserReviewLikeModel");
const UserReviewReplyLikeModel = require("../../models/UserAuth/UserReviewReplyLikeModel");
const UserReviewReplyModel = require("../../models/UserAuth/UserReviewReplyModel");
const UserWatchlistModel = require("../../models/UserAuth/UserWatchlistModel");
const moment = require("moment");

// ======================================================
// ✅ EXTRACT YOUTUBE THUMBNAIL
// ======================================================
const getYoutubeThumbnail = (url) => {
  try {
    if (!url) {
      return "";
    }

    // ================================================
    // ✅ GET VIDEO ID
    // ================================================

    const videoId = url.split("v=")[1]?.split("&")[0];

    if (!videoId) {
      return "";
    }

    // ================================================
    // ✅ RETURN THUMBNAIL
    // ================================================

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  } catch (error) {
    return "";
  }
};

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
    // ✅ GET CURRENT LOGIN USER
    // ======================================================

    const userId = req.user?.id;

    // ======================================================
    // ✅ USER VALIDATION
    // ======================================================

    if (!userId) {
      return res.status(401).json({
        success: false,

        message: "User not found",
      });
    }

    // ======================================================
    // ✅ GET ALL WATCHLIST
    // ======================================================

    const watchlist = await UserWatchlistModel.findAll({
      where: {
        userId,
      },
      // ====================================================
      // ✅ INCLUDE MOVIE DETAILS
      // ====================================================
      include: [
        {
          model: Movie,
          as: "movie",
          required: false,
          // ================================================
          // ✅ ONLY REQUIRED FIELDS
          // ================================================
          attributes: [
            "id",
            "title",
            "director",
            "cast",
            "genres",
            "imdbRating",
            "trailerUrl",
            "theatreReleaseDate",
            "ottReleaseDate",
            "durationOrSeason",
            "language",
            "status",
          ],
        },
      ],

      // ====================================================
      // ✅ LATEST FIRST
      // ====================================================

      order: [["createdAt", "DESC"]],
    });

    // ======================================================
    // ✅ CLEAN RESPONSE
    // ======================================================
    const formattedWatchlist = watchlist.map((item) => {
      const movie = item.movie;
      // ====================================================
      // ✅ SAFETY CHECK
      // ====================================================
      if (!movie) {
        return null;
      }
      // ====================================================
      // ✅ RELEASE DATE
      // THEATRE FIRST
      // ELSE OTT
      // ====================================================
      const releaseDate = movie.theatreReleaseDate || movie.ottReleaseDate;
      // ====================================================
      // ✅ FORMAT DATE
      // ====================================================
      const formattedDate = releaseDate
        ? moment(releaseDate).format("MMMM DD YYYY").toUpperCase()
        : null;
      // ====================================================
      // ✅ PARSE GENRES
      // ====================================================
      let parsedGenres = [];
      try {
        parsedGenres = JSON.parse(movie.genres || []);
      } catch (error) {
        parsedGenres = [];
      }

      // ==============================================
      // ✅ PARSE LANGUAGE
      // ==============================================

      let parsedLanguages = [];

      try {
        parsedLanguages = JSON.parse(movie.language || "[]");
      } catch (error) {
        parsedLanguages = [];
      }
      // ====================================================
      // ✅ CLEAN CAST
      // ====================================================
      const castNames = movie.cast
        ? movie.cast.split(",").slice(0, 2).join(", ")
        : "";

      return {
        id: item.id,
        createdAt: item.createdAt,
        movie: {
          id: movie.id,
          title: movie.title,
          director: movie.director,
          cast: castNames,
          genres: parsedGenres.join(","),
          imdbRating: movie.imdbRating,
          duration: movie.durationOrSeason,
          language: parsedLanguages.join(", "),
          status: movie.status,
          // ==============================================
          // ✅ FORMATTED RELEASE DATE
          // ==============================================
          releaseDate: formattedDate,
          // ==============================================
          // ✅ TRAILER
          // ==============================================
          trailerUrl: movie.trailerUrl,
          trailerThumbnail: getYoutubeThumbnail(movie.trailerUrl),
        },
      };
    });
    // ======================================================
    // ✅ REMOVE NULL MOVIES
    // ======================================================
    const filteredWatchlist = formattedWatchlist.filter(Boolean);

    // ======================================================
    // ✅ RESPONSE
    // ======================================================

    return res.status(200).json({
      success: true,

      count: filteredWatchlist.length,

      data: filteredWatchlist,
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

exports.getMovieReviews = async (req, res) => {
  try {
    // ==========================================
    // ✅ PARAMS
    // ==========================================

    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required",
      });
    }

    // ==========================================
    // ✅ CURRENT USER
    // ==========================================

    const currentUserId = req.user?.id || null;

    // ==========================================
    // ✅ GET REVIEWS
    // ==========================================

    const reviews = await UserMovieRatingModel.findAll({
      where: {
        movieId,
        reviewStatus: "PUBLISHED",
      },

      include: [
        {
          model: UserAuthModel,
          as: "reviewUser",
          attributes: ["id", "fullName", "username", "profileImage"],
        },

        {
          model: UserReviewLikeModel,
          as: "reviewLikes",
          attributes: ["userId"],
          required: false,
        },
        {
          model: UserReviewReplyModel,
          as: "reviewReplies",
          required: false,

          attributes: [
            "id",
            "reply",
            "userId",
            "totalLikes",
            "createdAt",
            "updatedAt",
          ],

          include: [
            {
              model: UserAuthModel,
              as: "user",

              attributes: ["id", "fullName", "username", "profileImage"],
            },
            // ✅ EXTRA ASSOCIATION: Nested Replies oda Like array map-a evaluate panroam
            {
              model: UserReviewReplyLikeModel,
              as: "replyLikes",
              attributes: ["userId"],
              required: false,
            },
          ],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    // ==========================================
    // ✅ TOTAL REVIEWS
    // ==========================================

    const totalReviews = reviews.length;

    // ==========================================
    // ✅ AVERAGE RATING
    // ==========================================

    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
            totalReviews
          ).toFixed(1)
        : "0.0";

    // ==========================================
    // ✅ FORMAT RESPONSE
    // ==========================================

    const formattedReviews = reviews.map((review) => {
      const reviewData = review.toJSON();

      return {
        ...reviewData,

        isLiked:
          reviewData.reviewLikes?.some(
            (like) => like.userId === currentUserId,
          ) || false,
        isOwn: reviewData.userId === currentUserId,
        reviewReplies:
          reviewData.reviewReplies?.map((reply) => ({
            ...reply,

            isOwn: reply.userId === currentUserId,
            isLiked:
              reply.replyLikes?.some((l) => l.userId === currentUserId) ||
              false,
          })) || [],
        // replies: reviewData.reviewReplies || [],
      };
    });

    // ==========================================
    // ✅ SUCCESS
    // ==========================================

    return res.status(200).json({
      success: true,

      averageRating,

      totalReviews,

      data: formattedReviews,
    });
  } catch (error) {
    console.log("GET MOVIE REVIEWS ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

exports.toggleReviewLike = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // ==========================================
    // ✅ LOGIN CHECK
    // ==========================================

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        loginRequired: true,
        message: "Please login to like this review",
      });
    }

    const userId = req.user.id;
    const { reviewId } = req.body;

    // ==========================================
    // ✅ VALIDATION
    // ==========================================

    if (!reviewId) {
      return res.status(400).json({
        success: false,
        message: "Review ID is required",
      });
    }

    // ==========================================
    // ✅ GET REVIEW + LIKE STATUS
    // ==========================================

    const [review, existingLike] = await Promise.all([
      UserMovieRatingModel.findByPk(reviewId, {
        transaction,
      }),

      UserReviewLikeModel.findOne({
        where: {
          userId,
          reviewId,
        },
        transaction,
      }),
    ]);

    // ==========================================
    // ✅ REVIEW NOT FOUND
    // ==========================================

    if (!review) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // ==========================================
    // ✅ REMOVE LIKE
    // ==========================================

    if (existingLike) {
      await Promise.all([
        existingLike.destroy({
          transaction,
        }),

        review.decrement("totalLikes", {
          by: 1,
          transaction,
        }),
      ]);

      await transaction.commit();

      return res.status(200).json({
        success: true,
        liked: false,
        totalLikes: Math.max(0, Number(review.totalLikes) - 1),
        message: "Review like removed",
      });
    }

    // ==========================================
    // ✅ ADD LIKE
    // ==========================================

    await Promise.all([
      UserReviewLikeModel.create(
        {
          userId,
          reviewId,
        },
        {
          transaction,
        },
      ),

      review.increment("totalLikes", {
        by: 1,
        transaction,
      }),
    ]);

    await transaction.commit();

    return res.status(200).json({
      success: true,
      liked: true,
      totalLikes: Number(review.totalLikes) + 1,
      message: "Review liked successfully",
    });
  } catch (error) {
    await transaction.rollback();

    console.log("TOGGLE REVIEW LIKE ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update review like",
      error: error.message,
    });
  }
};

exports.addReviewReply = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // ==========================================
    // ✅ LOGIN CHECK
    // ==========================================
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        loginRequired: true,
        message: "Please login to reply",
      });
    }
    const userId = req.user.id;
    const { reviewId, reply } = req.body;
    // ==========================================
    // ✅ VALIDATION
    // ==========================================
    if (!reviewId) {
      return res.status(400).json({
        success: false,
        message: "Review ID is required",
      });
    }
    if (!reply?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply is required",
      });
    }
    // ==========================================
    // ✅ FIND REVIEW
    // ==========================================
    const review = await UserMovieRatingModel.findByPk(reviewId);
    if (!review) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    // ==========================================
    // ✅ CREATE REPLY + UPDATE COUNT
    // ==========================================

    const [newReply] = await Promise.all([
      UserReviewReplyModel.create(
        {
          reviewId,
          userId,
          reply: reply.trim(),
        },
        {
          transaction,
        },
      ),

      review.increment("totalReplies", {
        by: 1,
        transaction,
      }),
    ]);

    const replyWithUser = await UserReviewReplyModel.findByPk(newReply.id, {
      include: [
        {
          model: UserAuthModel,
          as: "user",
          attributes: ["id", "fullName", "username", "profileImage"],
        },
      ],
    });

    await transaction.commit();
    return res.status(201).json({
      success: true,
      message: "Reply added successfully",
      data: {
        id: replyWithUser.id,
        reviewId: replyWithUser.reviewId,
        userId: replyWithUser.userId,
        reply: replyWithUser.reply,
        createdAt: replyWithUser.createdAt,
        updatedAt: replyWithUser.updatedAt,
        isOwn: true,
        user: {
          id: replyWithUser.user.id,
          fullName: replyWithUser.user.fullName,
          username: replyWithUser.user.username,
          profileImage: replyWithUser.user.profileImage,
        },
      },
    });
  } catch (error) {
    await transaction.rollback();

    console.log("ADD REVIEW REPLY ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add reply",
      error: error.message,
    });
  }
};

exports.getReviewReplies = async (req, res) => {
  try {
    const { reviewId } = req.params;
    // ==========================================
    // ✅ VALIDATION
    // ==========================================

    if (!reviewId) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
    // ==========================================
    // ✅ GET REPLIES
    // ==========================================
    const replies = await UserReviewReplyModel.findAll({
      where: {
        reviewId,
      },
      include: [
        {
          model: UserAuthModel,
          as: "user",
          attributes: ["id", "fullName", "username", "profileImage"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    // ==========================================
    // ✅ FORMAT RESPONSE
    // ==========================================
    const formattedReplies = replies.map((reply) => ({
      id: reply.id,
      reviewId: reply.reviewId,
      reply: reply.reply,
      createdAt: reply.createdAt,
      user: reply.user
        ? {
            id: reply.user.id,
            name: reply.user.fullName,
            username: reply.user.username,
            profileImage: reply.user.profileImage,
          }
        : null,
    }));
    // ==========================================
    // ✅ SUCCESS
    // ==========================================

    return res.status(200).json({
      success: true,
      count: formattedReplies.length,
      data: formattedReplies,
    });
  } catch (error) {
    console.log("GET REVIEW REPLIES ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch review replies",
      error: error.message,
    });
  }
};

exports.updateReview = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // ==========================================
    // ✅ LOGIN CHECK
    // ==========================================
    if (!req.user?.id) {
      await transaction.rollback();
      return res.status(401).json({
        success: false,
        loginRequired: true,
        message: "Please login to update review",
      });
    }
    const userId = req.user.id;
    const { reviewId } = req.params;

    const { rating, review } = req.body;
    // ==========================================
    // ✅ VALIDATION
    // ==========================================

    if (!reviewId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
    if (!rating || rating < 1 || rating > 10) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 10",
      });
    }
    // ==========================================
    // ✅ FIND REVIEW
    // ==========================================
    const existingReview = await UserMovieRatingModel.findOne({
      where: {
        id: reviewId,
        userId,
      },
      transaction,
    });
    if (!existingReview) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    // ==========================================
    // ✅ UPDATE REVIEW
    // ==========================================
    await existingReview.update(
      {
        rating,
        review: review?.trim() || "",
      },
      {
        transaction,
      },
    );
    // ==========================================
    // ✅ COMMIT
    // ==========================================

    await transaction.commit();
    // ==========================================
    // ✅ SUCCESS
    // ==========================================
    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: {
        id: existingReview.id,
        movieId: existingReview.movieId,
        rating: existingReview.rating,
        review: existingReview.review,
        totalLikes: existingReview.totalLikes,
        totalReplies: existingReview.totalReplies,
        updatedAt: existingReview.updatedAt,
        isEdited:
          existingReview.createdAt.getTime() !==
          existingReview.updatedAt.getTime(),
      },
    });
  } catch (error) {
    // ==========================================
    // ✅ ROLLBACK
    // ==========================================

    await transaction.rollback();

    console.log("UPDATE REVIEW ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    if (!req.user?.id) {
      await transaction.rollback();

      return res.status(401).json({
        success: false,
        loginRequired: true,
        message: "Please login to delete review",
      });
    }
    const userId = req.user.id;
    const { reviewId } = req.params;
    // ==========================================
    // ✅ VALIDATION
    // ==========================================
    if (!reviewId?.trim()) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
    // ==========================================
    // ✅ FIND REVIEW
    // ==========================================
    const review = await UserMovieRatingModel.findOne({
      where: {
        id: reviewId,
        userId,
      },
      transaction,
    });
    // ==========================================
    // ✅ REVIEW NOT FOUND
    // ==========================================

    if (!review) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    // ==========================================
    // ✅ STORE INFO BEFORE DELETE
    // ==========================================
    const deletedReviewData = {
      id: review.id,
      movieId: review.movieId,
      rating: review.rating,
      totalLikes: review.totalLikes,
      totalReplies: review.totalReplies,
    };
    // ==========================================
    // ✅ DELETE REVIEW LIKES
    // ==========================================

    await UserReviewLikeModel.destroy({
      where: {
        reviewId,
      },
      transaction,
    });
    // ==========================================
    // ✅ DELETE REVIEW
    // ==========================================

    await review.destroy({
      transaction,
    });
    await transaction.commit();
    return res.status(200).json({
      success: true,
      deleted: true,
      message: "Review deleted successfully",

      data: deletedReviewData,
    });
  } catch (error) {
    await transaction.rollback();

    console.log("DELETE REVIEW ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

exports.updateReviewReply = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // ==========================================
    // ✅ LOGIN CHECK
    // ==========================================

    if (!req.user?.id) {
      await transaction.rollback();

      return res.status(401).json({
        success: false,
        loginRequired: true,
        message: "Please login to update reply",
      });
    }
    // ==========================================
    // ✅ GET DATA
    // ==========================================
    const userId = req.user.id;
    const { replyId } = req.params;
    const { reply } = req.body;
    // ==========================================
    // ✅ VALIDATION
    // ==========================================
    if (!replyId?.trim()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
    if (!reply?.trim()) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Reply cannot be empty",
      });
    }
    if (reply.trim().length < 2) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Reply must be at least 2 characters",
      });
    }
    if (reply.trim().length > 1000) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Reply cannot exceed 1000 characters",
      });
    }
    // ==========================================
    // ✅ FIND REPLY
    // ==========================================
    const existingReply = await UserReviewReplyModel.findOne({
      where: {
        id: replyId,
        userId,
      },
      transaction,
    });
    // ==========================================
    // ✅ NOT FOUND
    // ==========================================
    if (!existingReply) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Reply message not found ",
      });
    }
    // ==========================================
    // ✅ UPDATE REPLY
    // ==========================================
    await existingReply.update(
      {
        reply: reply.trim(),
      },
      {
        transaction,
      },
    );
    await transaction.commit();
    return res.status(200).json({
      success: true,
      message: "Reply updated successfully",

      data: {
        id: existingReply.id,
        reviewId: existingReply.reviewId,
        userId: existingReply.userId,
        reply: existingReply.reply,

        createdAt: existingReply.createdAt,
        updatedAt: existingReply.updatedAt,

        isEdited:
          existingReply.createdAt.getTime() !==
          existingReply.updatedAt.getTime(),
      },
    });
  } catch (error) {
    await transaction.rollback();

    console.log("UPDATE REVIEW REPLY ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update reply",
      error: error.message,
    });
  }
};

exports.deleteReviewReply = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // ==========================================
    // ✅ LOGIN CHECK
    // ==========================================

    if (!req.user?.id) {
      await transaction.rollback();

      return res.status(401).json({
        success: false,
        loginRequired: true,
        message: "Please login to delete reply",
      });
    }

    const userId = req.user.id;
    const { replyId } = req.params;
    // ==========================================
    // ✅ VALIDATION
    // ==========================================
    if (!replyId?.trim()) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }

    const reply = await UserReviewReplyModel.findOne({
      where: {
        id: replyId,
        userId,
      },
      transaction,
    });
    // ==========================================
    // ✅ NOT FOUND
    // ==========================================

    if (!reply) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }
    // ==========================================
    // ✅ FIND REVIEW
    // ==========================================
    const review = await UserMovieRatingModel.findByPk(reply.reviewId, {
      transaction,
    });
    // ==========================================
    // ✅ STORE DATA BEFORE DELETE
    // ==========================================

    const deletedReplyData = {
      id: reply.id,
      reviewId: reply.reviewId,
      userId: reply.userId,
      reply: reply.reply,
    };
    // ==========================================
    // ✅ DELETE REPLY
    // ==========================================

    await reply.destroy({
      transaction,
    });
    // ==========================================
    // ✅ UPDATE REPLY COUNT
    // ==========================================

    if (review && review.totalReplies > 0) {
      await review.decrement("totalReplies", {
        by: 1,
        transaction,
      });
    }
    await transaction.commit();
    return res.status(200).json({
      success: true,
      deleted: true,
      message: "Reply deleted successfully",

      data: deletedReplyData,
    });
  } catch (error) {
    await transaction.rollback();

    console.log("DELETE REVIEW REPLY ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete reply",
      error: error.message,
    });
  }
};

exports.toggleReplyLike = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        loginRequired: true,
        message: "Please login to like this reply",
      });
    }
    const userId = req.user.id;
    const { replyId } = req.body;
    if (!replyId) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
    // Find targeting review reply message along with existing user like mapping status
    const [replyItem, existingLike] = await Promise.all([
      UserReviewReplyModel.findByPk(replyId, { transaction }),
      UserReviewReplyLikeModel.findOne({
        where: { userId, replyId },
        transaction,
      }),
    ]);
    if (!replyItem) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Reply message not found",
      });
    }
    // REMOVE REPLY LIKE FLOW
    if (existingLike) {
      await Promise.all([
        existingLike.destroy({ transaction }),
        replyItem.decrement("totalLikes", { by: 1, transaction }),
      ]);

      await transaction.commit();
      return res.status(200).json({
        success: true,
        liked: false,
        totalLikes: Math.max(0, Number(replyItem.totalLikes) - 1),
        message: "Reply like removed",
      });
    }
    // ADD REPLY LIKE FLOW
    await Promise.all([
      UserReviewReplyLikeModel.create({ userId, replyId }, { transaction }),
      replyItem.increment("totalLikes", { by: 1, transaction }),
    ]);
    await transaction.commit();
    return res.status(200).json({
      success: true,
      liked: true,
      totalLikes: Number(replyItem.totalLikes) + 1,
      message: "Reply liked successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.log("TOGGLE REPLY LIKE ERROR", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process reply like action",
      error: error.message,
    });
  }
};
