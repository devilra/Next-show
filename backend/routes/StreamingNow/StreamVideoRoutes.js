const express = require("express");
const {
  AdminAuthProtect,
} = require("../../middlewares/AdminAuthMiddleware/AdminMiddleware");
const {
  getAllStreamingContent,
  getActiveStreamingContent,
  createStreamingNow,
  updateStreamingNow,
  deleteStreamingNow,
} = require("../../controllers/StreamingNow/StreaminVideoControl");
const { uploadMix } = require("../../config/cloudinaryConfig");

const router = express.Router();

// 1. அனைத்து கன்டென்ட்களையும் பெறுதல் (Admin View)
router.get("/streaming-all", AdminAuthProtect, getAllStreamingContent);

// 2. UI-க்காக Active கன்டென்ட்களை மட்டும் பெறுதல் (Public/User View)
// ஒருவேளை இது Public User-க்கு என்றால் AdminAuthProtect-ஐ நீக்கிவிடலாம்
router.get("/streaming-active", getActiveStreamingContent);

// 3. புதிய ஸ்ட்ரீமிங் வீடியோவை உருவாக்குதல் (Create)
router.post(
  "/streaming-create",
  AdminAuthProtect,
  uploadMix.fields([
    {
      name: "bannerImage",
      maxCount: 1,
    },
    {
      name: "videoUrl",
      maxCount: 1,
    },
  ]),
  createStreamingNow,
);

// 4. விவரங்களை புதுப்பித்தல் (Update)
router.put(
  "/streaming-update/:id",
  AdminAuthProtect,
  uploadMix.fields([
    {
      name: "bannerImage",
      maxCount: 1,
    },
    {
      name: "videoUrl",
      maxCount: 1,
    },
  ]),
  updateStreamingNow,
);

router.delete("/streaming-delete/:id", AdminAuthProtect, deleteStreamingNow);

module.exports = router;
