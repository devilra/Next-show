const express = require("express");
const {
  getActiveBlogs,
  getAllBlogs,
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../../controllers/HomeControllers/blogController");
const {
  AdminAuthProtect,
} = require("../../middlewares/AdminAuthMiddleware/AdminMiddleware");

// 🔥 IMPORTANT: Make sure this name matches your Cloudinary/Multer config file
const { uploadMix } = require("../../config/cloudinaryConfig"); 

const router = express.Router();

// 1. PUBLIC: Get only active blogs for the News Page
router.get("/blogs-active", getActiveBlogs);

// 2. PUBLIC: Get a single blog detail
router.get("/blog-detail/:id", getBlogById);

// 3. ADMIN: Get all blogs (including inactive ones)
router.get("/blogs-all", AdminAuthProtect, getAllBlogs);

// 4. ADMIN: Create new blog with Image Upload
router.post(
  "/blog-create",
  AdminAuthProtect,
  uploadMix.single("bannerImage"), // 'bannerImage' must match the name in your React FormData
  createBlog
);

// 5. ADMIN: Update blog (can also update image)
router.put(
  "/blog-update/:id",
  AdminAuthProtect,
  uploadMix.single("bannerImage"),
  updateBlog
);

// 6. ADMIN: Delete blog
router.delete("/blog-delete/:id", AdminAuthProtect, deleteBlog);

module.exports = router;