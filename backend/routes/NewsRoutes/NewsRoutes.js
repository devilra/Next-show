const express = require("express");
const {
  AdminAuthProtect,
} = require("../../middlewares/AdminAuthMiddleware/AdminMiddleware");
const uploadNews = require("../../middlewares/NewsMiddleware/newsUpload");
const {
  uploadNewsImages,
  deleteNewsImage,
} = require("../../controllers/CentralizedNewsController/NewsUploadController/NewsUploadController");
const {
  createNews,
  getNewsDetailsBySlug,
  updateNews,
  deleteNews,
  getAllNewsAdmin,
} = require("../../controllers/CentralizedNewsController/CentralizedNewsController");
const {
  getLatestNews,
  getHeroTrendingNews,
  getTrendingNews,
  getRelatedNews,
} = require("../../controllers/CentralizedNewsController/NewsAllGetController");
const {
  UserProtect,
} = require("../../middlewares/UserAuthMiddleware/UserAuthMiddleware");
const {
  OptionalUserProtect,
} = require("../../middlewares/NewsMiddleware/OptionalUserNewsMiddleware");
const router = express.Router();

// Route Definition
// POST: http://localhost:5176/api/admin/upload-news-images

router.post(
  "/upload-news-images",
  AdminAuthProtect,
  uploadNews.array("newsImages", 10), // middleware (max 10 images)
  uploadNewsImages,
);

/**
 *
 * @METHOD : POST
 * @DESC : Admin news create panna (Published or Draft)
 */

router.post("/create-news", AdminAuthProtect, createNews);

router.delete("/delete-news-image", AdminAuthProtect, deleteNewsImage);

router.get("/get-all-news", getAllNewsAdmin);

router.get("/get-news-details/:slug", getNewsDetailsBySlug);

router.get("/latest-news", getLatestNews);

router.get("/hero-trending-news", OptionalUserProtect, getHeroTrendingNews);

router.get("/trending-news", getTrendingNews);

router.get("/related-news/:slug", getRelatedNews);

router.put(
  "/update-news/:id",
  AdminAuthProtect,
  uploadNews.array("newsImages", 10),
  updateNews,
);

router.delete("/delete-news/:id", AdminAuthProtect, deleteNews);

module.exports = router;
