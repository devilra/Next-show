const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================================================
// ✅ PROFILE IMAGE STORAGE
// ======================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // ======================================================
      // ✅ USER ID GET
      // ======================================================
      // Example:
      // req.user.id
      // req.admin.id
      // req.body.userId
      const userId = req.user?.id || req.body.userId;
      // ======================================================
      // ✅ USER ID CHECK
      // ======================================================
      if (!userId) {
        return cb(new Error("User ID is required"));
      }
      // ======================================================
      // ✅ SAVE USER ID IN REQ
      // ======================================================
      req.profileUserId = userId;
      const uploadDir = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "uploads",
        "profile",
        String(userId),
      );

      // ======================================================
      // ✅ CREATE FOLDER ONLY IF NOT EXISTS
      // ======================================================
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // ======================================================
      // ✅ DELETE OLD IMAGES INSIDE USER FOLDER
      // ======================================================
      const existingFiles = fs.readdirSync(uploadDir);
      existingFiles.forEach((file) => {
        const filePath = path.join(uploadDir, file);
        // delete only files
        if (fs.lstatSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
      // ======================================================
      // ✅ FINAL DESTINATION
      // ======================================================
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  // ======================================================
  // ✅ FILE NAME
  // ======================================================
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Example:
    // profile-17167282.png
    const fileName = `profile-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

// ======================================================
// ✅ FILE FILTER
// ======================================================
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only image files (jpg, jpeg, png, webp, gif) are allowed"));
};

// ======================================================
// ✅ MULTER INSTANCE
// ======================================================
const uploadProfileImage = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter,
});

module.exports = uploadProfileImage;
