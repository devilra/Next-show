const express = require("express");
const {
  AdminAuthProtect,
} = require("../../middlewares/AdminAuthMiddleware/AdminMiddleware");
const upload = require("../../middlewares/CastMiddleware/CastMulter");
const {
  createCast,
  getCastList,
} = require("../../controllers/CastController/castController");
const router = express.Router();

/**
 * @route   POST /api/casts/create
 * @desc    Create a new cast member with local image upload
 * @access  Public (Pinnala RBAC/Auth add pannikalam)
 */

router.post(
  "/cast-create",
  AdminAuthProtect,
  upload.single("profileImage"),
  createCast,
);

/**
 * @route   GET /api/v1/casts/select-list
 * @desc    Get Cast list for React Select dropdown
 * @access  Admin (or Protected)
 */
router.get("/all-cast", AdminAuthProtect, getCastList);

module.exports = router;
