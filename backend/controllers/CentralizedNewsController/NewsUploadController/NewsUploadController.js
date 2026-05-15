const path = require("path");
const fs = require("fs");

exports.uploadNewsImages = (req, res) => {
  try {
    // 1. Files upload aagalai na error handle pannurom
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded. Please select at least one image.",
      });
    }

    // Middleware-la irundhu varra exact folder name-ah edukirom
    const folderName = req.uploadDirName; // e.g., "2026-05-09"

    const filePaths = req.files.map((file) => {
      // Direct-ah middleware anuppuna folder name vachi path create panrom
      return `/uploads/news/${folderName}/${file.filename}`;
    });

    return res.status(200).json({
      success: true,
      message: `${req.files.length} images uploaded!`,
      data: filePaths,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteNewsImage = (req, res) => {
  try {
    const { imagePath } = req.body; // Client-ல இருந்து "/uploads/news/..." path வரும்
    console.log(imagePath);
    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: "Image path is required to delete.",
      });
    }

    // 1. Path-oda starting-la slash irundha thookirom
    // e.g., "/uploads/news/..." becomes "uploads/news/..."
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.substring(1)
      : imagePath;

    // Server-ல இருக்குற absolute path-ஐ கண்டுபுடிக்கணும்
    // imagePath "/uploads/..."-ன்னு இருந்தா அதை string manipulation பண்ணி root folder-க்கு மாத்தணும்

    const absolutePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      cleanPath,
    );

    // console.log("Full Path to Delete:", absolutePath);

    // குறிப்பு: உங்க project structure-க்கு ஏத்த மாதிரி '../..' அட்ஜஸ்ட் பண்ணிக்கோங்க

    // File உண்மையாவே அந்த folder-ல இருக்கான்னு check பண்ணுங்க
    if (fs.existsSync(absolutePath)) {
      fs.unlink(absolutePath, (err) => {
        if (err) {
          console.error("FS Unlink Error:", err);
          return res.status(500).json({
            success: false,
            message: "Error deleting file from server.",
          });
        }
        return res.status(200).json({
          success: true,
          message: "Image deleted successfully from server!",
        });
      });
    } else {
      console.log("No  File :", absolutePath);
      return res.status(404).json({
        success: false,
        message: "Image not found on server.",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
