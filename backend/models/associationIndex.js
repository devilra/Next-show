const Movie = require("../models/CentralizedMoviesCreateModels/CentralizedMovieCreate");
const Cast = require("../models/Cast/Cast");
const MovieCast = require("../models/MovieCast/MovieCast");

// 1. Oru movie-la neraiya cast irupanga
Movie.belongsToMany(Cast, {
  through: MovieCast,
  foreignKey: "movieId",
  otherKey: "castId",
});

// 2. Oru cast (actor) neraiya movies-la irupanga
Cast.belongsToMany(Movie, {
  through: MovieCast,
  foreignKey: "castId",
  otherKey: "movieId",
});

module.exports = { Movie, Cast, MovieCast };
