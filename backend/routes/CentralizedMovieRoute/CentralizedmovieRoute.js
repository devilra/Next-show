const express = require("express");
const router = express.Router();

// Middlewares
const {
  AdminAuthProtect,
} = require("../../middlewares/AdminAuthMiddleware/AdminMiddleware");
const { uploadMix } = require("../../config/cloudinaryConfig");
const {
  getNewMoviesPageData,
  getStreamingNowPageData,
  getMovieDetailsBySlug,
  getAllMoviesAdmin,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../../controllers/CentralizedMovieCreateController/CentralizedMovieCreate");

// Controllers

/**
 * ==========================================
 * 1. PUBLIC ROUTES (Web/App UI-ku)
 * ==========================================
 */

// New Movies Page - Upcoming matrum New Releases kku
router.get("/newMovies-pageData", getNewMoviesPageData);

// Streaming Page - Trending matrum OTT Upcoming kku
router.get("/streamingNow-pageData", getStreamingNowPageData);

// Single Movie Details - Slug vachu full details edukka
router.get("/movie-details/:slug", getMovieDetailsBySlug);

/**
 * ==========================================
 * 2. ADMIN ROUTES (Dashboard Management)
 * ==========================================
 */

// Ella movies-aiyum paarkka (List View)
router.get("/all-movies", AdminAuthProtect, getAllMoviesAdmin);

// Pudhiya movie create panna (Banner Image-oda)
router.post(
  "/create-movie",
  AdminAuthProtect,
  uploadMix.fields([{ name: "bannerImage", maxCount: 1 }]),
  createMovie
);

// Movie details-ai update panna
router.put(
  "/update-movie/:id",
  AdminAuthProtect,
  uploadMix.fields([{ name: "bannerImage", maxCount: 1 }]),
  updateMovie
);

// Movie-ai database-la irunthu neekka
router.delete("/delete-movie/:id", AdminAuthProtect, deleteMovie);

module.exports = router;
