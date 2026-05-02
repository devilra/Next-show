const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // backend root-la irunthu public/uploads/casts folder-ku path set pandrom
    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      "casts",
    );

    // Folder illana create pannuvom
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, {
        recursive: true,
      });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Example: cast-1713800000-123456789.jpg
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() + 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Images are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
