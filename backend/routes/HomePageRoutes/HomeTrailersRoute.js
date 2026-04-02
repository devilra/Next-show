const express = require("express");

const {
  AdminAuthProtect,
} = require("../../middlewares/AdminAuthMiddleware/AdminMiddleware");

const { uploadMix } = require("../../config/cloudinaryConfig");
const {
  getAllHomeTrailers,
  getActiveHomeTrailers,
  createHomeTrailers,
  updateHomeTrailers,
  deleteHomeTrailers,
} = require("../../controllers/HomeControllers/HomeTrailersController");

const router = express.Router();

// 1. அனைத்து கன்டென்ட்களையும் பெறுதல் (Admin View)
router.get("/home-trailers-all", AdminAuthProtect, getAllHomeTrailers);

// 2. UI-க்காக Active கன்டென்ட்களை மட்டும் பெறுதல் (Public View)
router.get("/home-trailers-active", getActiveHomeTrailers);

// 3. புதிய கன்டென்டை உருவாக்குதல் (Create)
router.post(
  "/home-trailers-create",
  AdminAuthProtect,
  uploadMix.fields([
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),
  createHomeTrailers
);

// 4. விவரங்களை புதுப்பித்தல் (Update)
router.put(
  "/home-trailers-update/:id",
  AdminAuthProtect,
  uploadMix.fields([
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),
  updateHomeTrailers
);

// 5. நீக்குதல் (Delete)
router.delete(
  "/home-trailers-delete/:id",
  AdminAuthProtect,
  deleteHomeTrailers
);

module.exports = router;
