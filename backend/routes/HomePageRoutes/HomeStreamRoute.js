const express = require("express");

const {
  AdminAuthProtect,
} = require("../../middlewares/AdminAuthMiddleware/AdminMiddleware");
const {
  getAllHomeStreaming,
  getActiveHomeStreaming,
  createHomeStreaming,
  updateHomeStreaming,
  deleteHomeStreaming,
} = require("../../controllers/HomeControllers/HomeStreamController");
const { uploadMix } = require("../../config/cloudinaryConfig");

const router = express.Router();

// 1. அனைத்து கன்டென்ட்களையும் பெறுதல் (Admin View)
router.get("/home-streaming-all", AdminAuthProtect, getAllHomeStreaming);

// 2. UI-க்காக Active கன்டென்ட்களை மட்டும் பெறுதல் (Public View)
router.get("/home-streaming-active", getActiveHomeStreaming);

// 3. புதிய கன்டென்டை உருவாக்குதல் (Create)
router.post(
  "/home-streaming-create",
  AdminAuthProtect,
  uploadMix.fields([
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),
  createHomeStreaming
);

// 4. விவரங்களை புதுப்பித்தல் (Update)
router.put(
  "/home-streaming-update/:id",
  AdminAuthProtect,
  uploadMix.fields([
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),
  updateHomeStreaming
);

// 5. நீக்குதல் (Delete)
router.delete(
  "/home-streaming-delete/:id",
  AdminAuthProtect,
  deleteHomeStreaming
);

module.exports = router;
