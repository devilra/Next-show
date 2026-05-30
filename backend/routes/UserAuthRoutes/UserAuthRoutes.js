// ======================================================
// ✅ USER AUTH ROUTES
// FILE: routes/UserAuthRoutes/UserAuthRoutes.js
// ======================================================

const express = require("express");
const {
  manualSignup,
  manualLogin,
  googleLogin,
  logoutUser,
  getCurrentUser,
  updateProfileImage,
  updateUserAccountDetails,
} = require("../../controllers/UserAuthController/UserAuthController");
const {
  UserProtect,
  AdminProtect,
} = require("../../middlewares/UserAuthMiddleware/UserAuthMiddleware");
const uploadProfileImage = require("../../middlewares/ProfileUploadMiddleware/profileUpload");

const router = express.Router();

// ======================================================
// ✅ MANUAL SIGNUP
// POST : /api/user/auth-manual-signup
// ======================================================

router.post("/auth-manual-signup", manualSignup);

// ======================================================
// ✅ MANUAL LOGIN
// POST : /api/user/manual-login
// ======================================================
router.post("/manual-login", manualLogin);

// ======================================================
// ✅ GOOGLE LOGIN / SIGNUP
// POST : /api/user/google-login
// ======================================================
router.post("/google-login", googleLogin);

// ======================================================
// ✅ LOGOUT
// POST : /api/user/logout
// ======================================================
router.post("/user-logout", UserProtect, logoutUser);

// ======================================================
// ✅ CURRENT USER
// GET : /api/user/current-user
// ======================================================
router.get("/current-user", UserProtect, getCurrentUser);

// ======================================================
// ✅ UPDATE PROFILE IMAGE
// PUT : /api/auth/user/update-profile-image
// ======================================================
router.put(
  "/update-profile-image",
  UserProtect,
  uploadProfileImage.single("profileImage"),
  updateProfileImage,
);

router.put("/update-account-details", UserProtect, updateUserAccountDetails);

// ======================================================
// ✅ ADMIN TEST ROUTE
// GET : /api/user/admin-only
// ======================================================
router.get("/admin-only", UserProtect, AdminProtect, async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome Admin",
    user: req.user,
  });
});

module.exports = router;
