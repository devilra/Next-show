const express = require("express");
const {
  getAllTags,
  getSearchByTags, // 👈 Puthu search function
  getTagBySlug, // 👈 ID-ku pathila Slug function
  createTag,
  updateTag,
  deleteTag,
} = require("../../controllers/TagsController/TagsController");
const {
  AdminAuthProtect,
} = require("../../middlewares/AdminAuthMiddleware/AdminMiddleware");

const router = express.Router();

// --- PUBLIC ROUTES ---

// 1. Get all tags (Page load-la load panna)
router.get("/tags-all", getAllTags);

// 2. Search tags (Type panna panna search panna)
router.get("/tags-search", getSearchByTags);

// 3. Get a single tag by SLUG (ID-ku pathila slug use pandrom)
router.get("/tag-detail/:slug", getTagBySlug);

// --- ADMIN ROUTES (Protected) ---

// 4. Create new tag
router.post("/tag-create", AdminAuthProtect, createTag);

// 5. Update tag (Update-ku eppovum pola ID-ye irukkatum, backend-la slug automatic-ah update aagum)
router.put("/tag-update/:id", AdminAuthProtect, updateTag);

// 6. Delete tag
router.delete("/tag-delete/:id", AdminAuthProtect, deleteTag);

module.exports = router;
