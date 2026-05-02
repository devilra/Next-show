const express = require("express");
const router = express.Router();
const {
  getTMDBMovieDetails,
} = require("../../controllers/TMDB-Controller/tmdbController");

// 1. Initial Testing Route:
// Postman-la http://localhost:5000/api/movies/check-root-data nu hit pannunga
// Ithu controller-la irukura static ID (550) fetch panni full JSON-ah kaattum.
router.get("/check-root-data", getTMDBMovieDetails);

// Frontend-la irunthu: GET /api/movies/12345
// router.get('/:movieId', getTMDBMovieDetails);

module.exports = router;
