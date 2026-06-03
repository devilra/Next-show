const Movie = require("./CentralizedMoviesCreateModels/CentralizedJsonBulkCreate");
const MovieCast = require("./CentralizedMoviesCreateModels/MovieCast");
const Cast = require("./Cast/Cast");
const UserAuthModel = require("./UserAuth/UserAuth");
const UserWatchlistModel = require("./UserAuth/UserWatchlistModel");
const UserWatchLaterModel = require("./UserAuth/UserWatchLater");
const CentralizedNewsModel = require("./CentralizedNewsModels/CentralizedNewsModel");
const UserNewsLikeModel = require("./UserAuth/UserNewsLikeModel");
const UserMovieRatingModel = require("./UserAuth/UserMovieRating");
const UserReviewReplyModel = require("./UserAuth/UserReviewReplyModel");
const UserReviewLikeModel = require("./UserAuth/UserReviewLikeModel");
const UserReviewReplyLikeModel = require("./UserAuth/UserReviewReplyLikeModel");

// 1. Oru movie-la neraiya cast irupanga
Movie.belongsToMany(Cast, {
  through: MovieCast,
  foreignKey: "movieId",
  otherKey: "castId",
  as: "casts", // 👈 Ithu iruntha fetch panna easy
});

// 2. Oru cast (actor) neraiya movies-la irupanga
Cast.belongsToMany(Movie, {
  through: MovieCast,
  foreignKey: "castId",
  otherKey: "movieId",
});

// ⛓️ 3. Direct access to Junction Table (Very Important for Bulk Create)
// Movie create pannum pothu junction table-la characterName add panna ithu venum
Movie.hasOne(MovieCast, { foreignKey: "movieId", as: "organizedCast" });
MovieCast.belongsTo(Movie, { foreignKey: "movieId" });

Cast.hasMany(MovieCast, { foreignKey: "castId", as: "movieRoles" });
MovieCast.belongsTo(Cast, { foreignKey: "castId" });

// ============================================
// USER ↔ WATCHLIST
// ============================================
UserAuthModel.hasMany(UserWatchlistModel, {
  foreignKey: "userId",
  as: "watchlists",
});

UserWatchlistModel.belongsTo(UserAuthModel, {
  foreignKey: "userId",

  as: "user",
});

// ============================================
// MOVIE ↔ WATCHLIST
// ============================================

Movie.hasMany(UserWatchlistModel, {
  foreignKey: "movieId",

  as: "movieWatchlists",
});

UserWatchlistModel.belongsTo(Movie, {
  foreignKey: "movieId",

  as: "movie",
});

UserAuthModel.hasMany(UserWatchLaterModel, {
  foreignKey: "userId",
  as: "watchLater",
});
UserWatchLaterModel.belongsTo(UserAuthModel, {
  foreignKey: "userId",
  as: "user",
});

CentralizedNewsModel.hasMany(UserWatchLaterModel, {
  foreignKey: "newsId",
  as: "newsWatchLater",
});
UserWatchLaterModel.belongsTo(CentralizedNewsModel, {
  foreignKey: "newsId",
  as: "news",
});

// ============================================
// USER ↔ NEWS LIKE
// ============================================

UserAuthModel.hasMany(UserNewsLikeModel, {
  foreignKey: "userId",
  as: "newsLikes",
});

UserNewsLikeModel.belongsTo(UserAuthModel, {
  foreignKey: "userId",
  as: "user",
});

// ============================================
// NEWS ↔ LIKE
// ============================================

CentralizedNewsModel.hasMany(UserNewsLikeModel, {
  foreignKey: "newsId",
  as: "likes",
});

UserNewsLikeModel.belongsTo(CentralizedNewsModel, {
  foreignKey: "newsId",
  as: "news",
});

Movie.hasMany(UserMovieRatingModel, {
  foreignKey: "movieId",
  as: "reviews",
});

UserMovieRatingModel.belongsTo(Movie, {
  foreignKey: "movieId",
  as: "movie",
});

UserAuthModel.hasMany(UserMovieRatingModel, {
  foreignKey: "userId",
  as: "userReviews",
});

UserMovieRatingModel.belongsTo(UserAuthModel, {
  foreignKey: "userId",
  as: "reviewUser",
});
// ============================================
// USER ↔ REVIEW REPLIES
// ============================================

UserAuthModel.hasMany(UserReviewReplyModel, {
  foreignKey: "userId",
  as: "reviewReplies",
});

UserReviewReplyModel.belongsTo(UserAuthModel, {
  foreignKey: "userId",
  as: "user",
});

// ============================================
// REVIEW ↔ REVIEW LIKES
// ============================================

UserMovieRatingModel.hasMany(UserReviewLikeModel, {
  foreignKey: "reviewId",
  as: "reviewLikes",
});

UserReviewLikeModel.belongsTo(UserMovieRatingModel, {
  foreignKey: "reviewId",
  as: "review",
});

// ============================================
// USER ↔ REVIEW LIKES
// ============================================

UserAuthModel.hasMany(UserReviewLikeModel, {
  foreignKey: "userId",
  as: "userReviewLikes",
});

UserReviewLikeModel.belongsTo(UserAuthModel, {
  foreignKey: "userId",
  as: "user",
});
UserMovieRatingModel.hasMany(UserReviewReplyModel, {
  foreignKey: "reviewId",
  as: "reviewReplies",
});
UserReviewReplyModel.belongsTo(UserMovieRatingModel, {
  foreignKey: "reviewId",
  as: "review",
});
// ============================================
// REPLY ↔ REPLY LIKES ASSOCIATIONS
// ============================================

// Oru review reply message ku pala likes irukalam
UserReviewReplyModel.hasMany(UserReviewReplyLikeModel, {
  foreignKey: "replyId",
  as: "replyLikes",
});

UserReviewReplyLikeModel.belongsTo(UserReviewReplyModel, {
  foreignKey: "replyId",
  as: "reply",
});

// Oru user romba replies-a like pannalam
UserAuthModel.hasMany(UserReviewReplyLikeModel, {
  foreignKey: "userId",
  as: "userReplyLikes",
});

UserReviewReplyLikeModel.belongsTo(UserAuthModel, {
  foreignKey: "userId",
  as: "user",
});

module.exports = { Movie, Cast, MovieCast };
