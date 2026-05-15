const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // // 1. Innaiku date (e.g., 2026-05-09)
    // const today = new Date().toISOString().split("T")[0];

    // // Controller-la use panradhukkaga intha folder name-ah req-la save panrom
    // req.uploadDirName = today;

    // ==========================================
    // ✅ EXISTING FOLDER OR TODAY FOLDER
    // ==========================================

    let folderName = req.body.imageFolderId;

    // Create flow
    if (!folderName) {
      folderName = new Date().toISOString().split("T")[0];
    }

    // Save for controller
    req.uploadDirName = folderName;

    // 2. Exact Path based on your image: public/uploads/news/YYYY-MM-DD
    const uploadDir = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      "news",
      folderName,
    );

    // 3. Folder check & Automatic Creation
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Unique name: news-timestamp-random.jpg
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `news-${uniqueSuffix}${ext}`);
  },
});

// 4. File Filter (Only Images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Error: Only image files (jpg, jpeg, png, webp, gif) are allowed!",
    ),
  );
};

// 5. Multer Instance with 1MB Limit
const uploadNews = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024, // 1MB per file limit
  },
  fileFilter: fileFilter,
});

module.exports = uploadNews;
