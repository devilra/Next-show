const express = require("express");
const {
  UserProtect,
} = require("../../middlewares/UserAuthMiddleware/UserAuthMiddleware");
const {
  createBulkTrailerTeaser,
  getAllTrailerTeaser,
  getAdminSingleTrailerTeaserAdmin,
  getUserSingleTrailerTeaser,
  updateTrailerTeaser,
  deleteTrailerTeaser,
} = require("../../controllers/CentralizedTrailerTeaserController/CentralizedTrailerTeaser");
const {
  OptionalUserProtect,
} = require("../../middlewares/NewsMiddleware/OptionalUserNewsMiddleware");
const router = express.Router();

// ======================================
// ADMIN ROUTES
// ======================================
// Create Single / Bulk
router.post("/admin/trailer-teaser", UserProtect, createBulkTrailerTeaser);
// Get All
router.get("/admin/getAll-trailer-teaser", UserProtect, getAllTrailerTeaser);
// Get Single
router.get(
  "/admin/admin-trailer-teaser/:id",
  UserProtect,
  getAdminSingleTrailerTeaserAdmin,
);
//Get Single User
router.get(
  "/user-trailer-teaser/:slug",
  OptionalUserProtect,
  getUserSingleTrailerTeaser,
);
//update
router.put(
  "/admin/update-trailer-teaser/:id",
  UserProtect,
  updateTrailerTeaser,
);
// Delete (Soft Delete)
router.delete(
  "/admin/delete-tailer-teaser/:id",
  UserProtect,
  deleteTrailerTeaser,
);

module.exports = router;
