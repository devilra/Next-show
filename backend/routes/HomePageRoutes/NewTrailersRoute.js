const express = require("express");
const {
  getActiveTrailers,
  getAllTrailersAdmin,
  createTrailer,
  updateTrailer,
  deleteTrailer,
} = require("../../controllers/HomeControllers/newTrailerController");
const {
  AdminAuthProtect,
} = require("../../middlewares/AdminAuthMiddleware/AdminMiddleware");
const router = express.Router();

// -----------------------------------------------------------
// 1. PUBLIC ROUTE: UI-க்காக (No Auth Needed)
// -----------------------------------------------------------
// இதைப் பயன்படுத்திதான் ஸ்லைடரில் வீடியோக்களைக் காட்டுவீர்கள்

router.get("/new-trailers-active", getActiveTrailers);

// -----------------------------------------------------------
// 2. ADMIN ROUTES: Admin Panel CRUD (Auth Needed)
// -----------------------------------------------------------

// அனைத்து ட்ரெய்லர்களையும் பெறுதல் (டேபிளில் காட்ட)

router.get("/new-trailers-all", AdminAuthProtect, getAllTrailersAdmin);

// புதிய ட்ரெய்லரை உருவாக்குதல்
router.post("/new-trailers-create", AdminAuthProtect, createTrailer);

// விவரங்களை புதுப்பித்தல்
router.put("/new-trailers-update/:id", AdminAuthProtect, updateTrailer);

// நீக்குதல்
router.delete("/new-trailers-delete/:id", AdminAuthProtect, deleteTrailer);

module.exports = router;
