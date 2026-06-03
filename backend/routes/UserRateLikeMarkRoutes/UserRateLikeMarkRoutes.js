const express = require("express");
const {
  UserProtect,
} = require("../../middlewares/UserAuthMiddleware/UserAuthMiddleware");
const {
  toggleMarkWatched,
  checkMarkWatchedStatus,
  addOrUpdateMovieRating,
  getUserMovieRating,
  deleteMovieRating,
  addRecentView,
  getRecentViews,
  removeRecentView,
  clearAllRecentViews,
  toggleWatchlist,
  checkWatchlistStatus,
  getUserWatchlist,
  removeWatchlistItem,
  clearAllWatchlist,
  getMovieReviews,
  updateReview,
  deleteReview,
  toggleReviewLike,
  addReviewReply,
  getReviewReplies,
  updateReviewReply,
  deleteReviewReply,
  toggleReplyLike,
} = require("../../controllers/UserAuthController/UserRateLikeMarkController");
const {
  toggleWatchLater,
  checkWatchLaterStatus,
  getUserWatchLater,
  removeWatchLaterItem,
  clearAllWatchLater,
  toggleNewsLike,
  checkNewsLikeStatus,
  getNewsLikeCount,
  getUserLikedNews,
} = require("../../controllers/UserAuthController/UserWatchLaterController");
const {
  OptionalUserProtect,
} = require("../../middlewares/NewsMiddleware/OptionalUserNewsMiddleware");

const router = express.Router();

router.post("/toggle-mark-watched", UserProtect, toggleMarkWatched);

router.get("/check-mark-watched/:movieId", UserProtect, checkMarkWatchedStatus);

// ======================================================
// ✅ ADD OR UPDATE RATING
// ======================================================
router.post("/add-update-rating", UserProtect, addOrUpdateMovieRating);
// ======================================================
// ✅ ADD RECENT VIEW
// ======================================================
router.post("/add-recent-view", UserProtect, addRecentView);
// ======================================================
// ✅ GET RECENT VIEWS
// QUERY:
// ?contentType=MOVIE&limit=10
// ======================================================

router.post("/toggle-watchlist", UserProtect, toggleWatchlist);
// ======================================================
// ✅ WATCH LATER
// ======================================================
router.post("/toggle-watch-later", UserProtect, toggleWatchLater);

router.get("/check-watch-later/:newsId", UserProtect, checkWatchLaterStatus);

router.get("/watch-later", OptionalUserProtect, getUserWatchLater);

router.get("/check-watchlist/:movieId", UserProtect, checkWatchlistStatus);

router.get("/get-user-watchlist", UserProtect, getUserWatchlist);

router.get("/recent-views", UserProtect, getRecentViews);
// ======================================================
// ✅ GET USER MOVIE RATING
// ======================================================
router.get("/get-user-rating/:movieId", UserProtect, getUserMovieRating);

router.post("/toggle-news-like", UserProtect, toggleNewsLike);

// ======================================================
// ✅ CHECK NEWS LIKE STATUS
// ======================================================
router.get("/check-news-like/:newsId", UserProtect, checkNewsLikeStatus);

// ======================================================
// ✅ GET NEWS LIKE COUNT
// ======================================================
router.get("/news-like-count/:newsId", UserProtect, getNewsLikeCount);

// ======================================================
// ✅ GET USER LIKED NEWS
// ======================================================
router.get("/user-liked-news", UserProtect, getUserLikedNews);

// Get all reviews for a movie
router.get("/movie-reviews/:movieId", OptionalUserProtect, getMovieReviews);

// Update review
router.put("/update-review/:reviewId", UserProtect, updateReview);

// Delete review
router.delete("/delete-review/:reviewId", UserProtect, deleteReview);
// ======================================================
// ✅ REVIEW LIKES
// ======================================================
// Toggle review like
router.post("/toggle-review-like", UserProtect, toggleReviewLike);
// ======================================================
// ✅ REVIEW REPLIES
// ======================================================
// Add reply
router.post("/add-review-reply", UserProtect, addReviewReply);
router.post("/toggle-reply-like", UserProtect, toggleReplyLike);
// Get replies
router.get("/review-replies/:reviewId", getReviewReplies);
// Update reply
router.put("/update-review-reply/:replyId", UserProtect, updateReviewReply);
// Delete reply
router.delete("/delete-review-reply/:replyId", UserProtect, deleteReviewReply);

// ======================================================
// ✅ REMOVE SINGLE RECENT VIEW
// ======================================================

router.delete(
  "/remove-recent-view/:recentViewId",
  UserProtect,
  removeRecentView,
);
// ======================================================
// ✅ CLEAR ALL RECENT VIEWS
// ======================================================

router.delete("/clear-all-recent-views", UserProtect, clearAllRecentViews);

// ======================================================
// ✅ DELETE RATING
// ======================================================
router.delete("/delete-rating/:movieId", UserProtect, deleteMovieRating);

router.delete(
  "/remove-watchlist/:watchlistId",
  UserProtect,
  removeWatchlistItem,
);

router.delete("/clear-watchlist", UserProtect, clearAllWatchlist);

router.delete(
  "/remove-watch-later/:watchLaterId",
  UserProtect,
  removeWatchLaterItem,
);

router.delete("/clear-watch-later", UserProtect, clearAllWatchLater);

module.exports = router;
