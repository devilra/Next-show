const express = require("express");
const {
  getAllVideos,
  createVideoSection,
  updateVideoSection,
  deleteVideoSection,
  getActiveVideos,
} = require("../../controllers/HomeControllers/VideoSectionController");
const { uploadMix } = require("../../config/cloudinaryConfig");
const {
  AdminAuthProtect,
} = require("../../middlewares/AdminAuthMiddleware/AdminMiddleware");
const router = express.Router();

// 1. அனைத்து வீடியோக்களையும் பெறுதல் (Get All)
router.get("/video-all", AdminAuthProtect, getAllVideos);

//  UI-க்காக Active வீடியோக்களை மட்டும் பெறுதல் (Public Route)
router.get("/video-active", getActiveVideos);

// 2. புதிய வீடியோ பேனரை உருவாக்குதல் (Create)
// bannerImage மற்றும் videoUrl ஆகிய இரண்டு fields-ஐயும் multer கவனிக்கும்
router.post(
  "/video-create",
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
  createVideoSection
);

// 3. வீடியோ பேனரை புதுப்பித்தல் (Update)
router.put(
  "/video-update/:id",
  AdminAuthProtect,
  uploadMix.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "videoUrl", maxCount: 1 },
  ]),
  updateVideoSection
);

router.delete("/video-delete/:id", AdminAuthProtect, deleteVideoSection);

module.exports = router;
