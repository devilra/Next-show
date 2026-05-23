const Movie = require("./CentralizedMoviesCreateModels/CentralizedJsonBulkCreate");
const MovieCast = require("./CentralizedMoviesCreateModels/MovieCast");
const Cast = require("./Cast/Cast");
const UserAuthModel = require("./UserAuth/UserAuth");
const UserWatchlistModel = require("./UserAuth/UserWatchlistModel");

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

module.exports = { Movie, Cast, MovieCast };
