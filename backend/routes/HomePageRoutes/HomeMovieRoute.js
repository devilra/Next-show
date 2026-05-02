const express = require("express");

const {
  AdminAuthProtect,
} = require("../../middlewares/AdminAuthMiddleware/AdminMiddleware");

const { uploadMix } = require("../../config/cloudinaryConfig");
const {
  getAllHomeMovies,
  getActiveHomeMovies,
  createHomeMovies,
  updateHomeMovies,
  deleteHomeMovies,
} = require("../../controllers/HomeControllers/HomeMoviesController");

const router = express.Router();

// 1. அனைத்து கன்டென்ட்களையும் பெறுதல் (Admin View)
router.get("/home-movies-all", AdminAuthProtect, getAllHomeMovies);

// 2. UI-க்காக Active கன்டென்ட்களை மட்டும் பெறுதல் (Public View)
router.get("/home-movies-active", getActiveHomeMovies);

// 3. புதிய கன்டென்டை உருவாக்குதல் (Create)
router.post(
  "/home-movies-create",
  AdminAuthProtect,
  uploadMix.fields([
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),
  createHomeMovies
);

// 4. விவரங்களை புதுப்பித்தல் (Update)
router.put(
  "/home-movies-update/:id",
  AdminAuthProtect,
  uploadMix.fields([
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),
  updateHomeMovies
);

// 5. நீக்குதல் (Delete)
router.delete("/home-movies-delete/:id", AdminAuthProtect, deleteHomeMovies);

module.exports = router;
