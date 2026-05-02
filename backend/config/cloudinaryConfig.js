const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- 🖼️ IMAGE STORAGE ---
// const imageStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "ott_platform/images",
//     allowed_formats: ["jpg", "png", "jpeg", "webp"],
//     resource_type: "image", // இமேஜ் மட்டும்
//   },
// });

// // --- 🎥 VIDEO STORAGE ---
// const videoStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "ott_platform/videos",
//     resource_type: "video", // மிக முக்கியம்: இதுதான் வீடியோவாகச் சேமிக்க உதவும்
//     allowed_formats: ["mp4", "mkv", "mov", "avi"], // வீடியோ பார்மெட்கள்
//   },
// });

// // 2. Multer Middlewares
// const uploadImage = multer({
//   storage: imageStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for images
// });

// const uploadVideo = multer({
//   storage: videoStorage,
//   limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for videos (உங்களுக்கு ஏற்றவாறு மாற்றிக்கொள்ளலாம்)
// });

// module.exports = {
//   cloudinary,
//   uploadImage,
//   uploadVideo,
// };

// ----------------2nd Option--------------------------

// ஒரு பொதுவான ஸ்டோரேஜ் - இது இமேஜ் மற்றும் வீடியோ இரண்டிற்கும் தானாகவே மாறிக்கொள்ளும்
const generalStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = "ott_platform/others";
    let resourceType = "auto"; // 'auto' கொடுத்தால் Cloudinary தானாகவே அது இமேஜா அல்லது வீடியோவா என கண்டுபிடித்துவிடும்

    if (file.fieldname === "bannerImage") {
      folderName = "ott_platform/images";
      resourceType = "image";
    } else if (file.fieldname === "videoUrl") {
      folderName = "ott_platform/videos";
      resourceType = "video";
    }

    return {
      folder: folderName,
      resource_type: resourceType,
      allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "mkv", "mov"],
      chunk_size: 6000000, // 6MB chunks
      timeout: 120000, // 2 minutes for Cloudinary call
    };
  },
});

const uploadMix = multer({
  storage: generalStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

module.exports = { cloudinary, uploadMix };
