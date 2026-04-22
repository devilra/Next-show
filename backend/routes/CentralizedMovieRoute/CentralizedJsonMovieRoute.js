const express = require("express");
const {
  AdminAuthProtect,
} = require("../../middlewares/AdminAuthMiddleware/AdminMiddleware");
const {
  CentralizedCreateMovie,
  GetAllCentralizedJsonMovies,
  GetMovieAdminDetailsBySlug,
  CentralizedJsonDeleteMovie,
  getTrashMovies,
  restoreMovie,
  permanentDeleteMovies,
  getJsonMoviePublicHomeData,
} = require("../../controllers/CentralizedMovieCreateController/CentralizedJsonMovieCreate");

const router = express.Router();

/**
 * ==========================================
 * 1. PUBLIC ROUTES (End Users)
 * ==========================================
 */

// @desc    Get single movie details by slug for public/admin view
// @route   GET /api/v1/movies/details/:slug

router.get(
  "/get-movie-admin-details-by-slug/:slug",
  GetMovieAdminDetailsBySlug,
);

// @desc    Get organized home page data (Theatrical & Streaming)
// @route   GET /api/v1/admin/get-public-home-data
router.get("/get-public-home-data", getJsonMoviePublicHomeData);

// Ippo neenga create panna bulk logic single movie-kum work aagum,
// list of movies-kum work aagum.

/**
 * ==========================================
 * 2. ADMIN ROUTES (Dashboard Management)
 * ==========================================
 */

// Bulk Create Movie Route
// Idhula Banner Image upload (uploadMix) and Admin Protection (AdminAuthProtect) irukku

router.post("/publish-json-movies", AdminAuthProtect, CentralizedCreateMovie);

// @desc    Fetch ALL movie data for Admin Table (Full Data)
// @route   GET /api/v1/admin/movies/get-all-json-movies
router.get(
  "/get-all-json-movies",
  // AdminAuthProtect,
  GetAllCentralizedJsonMovies,
);

// @desc    Move a movie to trash (Soft Delete)
// @route   DELETE /api/v1/movies/delete-movie/:id
// @access  Private (Admin Only)
router.delete(
  "/delete-movie/:id",
  AdminAuthProtect,
  CentralizedJsonDeleteMovie,
);

// @desc    Get all movies from trash
// @route   GET /api/admin/get-trash-movies
router.get("/get-trash-movies", AdminAuthProtect, getTrashMovies);

// @desc    Restore movie from trash to main table
// @route   POST /api/admin/restore-movie/:trashId
// @access  Private (Admin Only)
router.post(
  "/restore-movie/:trashId", // Trash table-oda ID (primary key)
  AdminAuthProtect,
  restoreMovie,
);

// @desc    Permanent delete (Single or Bulk)
// @route   DELETE /api/admin/permanent-delete-movies
router.delete(
  "/permanent-delete-movies",
  AdminAuthProtect, // Admin token check panna
  permanentDeleteMovies,
);

module.exports = router;
