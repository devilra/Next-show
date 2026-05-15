const { Op } = require("sequelize");
const TagsModel = require("../../models/CentralizedNewsModels/TagsModel");
const slugify = require("slugify");

// 1. Get All Tags (Simple Fetch - No Search Logic)
// Ithu Page Load aagum pothu ellaa tags-aiyum edukka use aagum
exports.getAllTags = async (req, res) => {
  try {
    const tagsList = await TagsModel.findAll({
      // Alphabetical order-la iruntha select panna easy-ah irukkum
      order: [["name", "ASC"]],
      attributes: ["id", "name", "tagType", "slug", "color"],
      raw: true,
    });

    return res.status(200).json({
      success: true,
      count: tagsList.length,
      data: tagsList,
    });
  } catch (error) {
    console.error("Error fetching all tags:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching tags.",
    });
  }
};

// 2. Search Tags (Instant Search Logic)
// Frontend-la type panna panna query vachchi backend-la search panna use aagum
exports.getSearchByTags = async (req, res) => {
  try {
    const { q } = req.query; // Frontend-la irunthu '?q=...' nu query varum

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchResults = await TagsModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { tagType: { [Op.like]: `%${q}%` } },
        ],
      },
      limit: 15, // Search results rumba adhigamaa pogaama limit pandrom
      attributes: ["id", "name", "tagType", "slug", "color"],
      raw: true,
    });

    return res.status(200).json({
      success: true,
      count: searchResults.length,
      data: searchResults,
    });
  } catch (error) {
    console.error("Error in search tags:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while searching tags.",
    });
  }
};

// 2. Get Single Tag by Slug
exports.getTagBySlug = async (req, res) => {
  try {
    const { slug } = req.params; // Ippo params-la irundhu 'slug' edukkurom

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Tag slug is required",
      });
    }

    // findByPk-ku pathila 'findOne' use panni slug vachchi search pandrom
    const tag = await TagsModel.findOne({
      where: { slug: slug },
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "The tag you are looking for does not exist.",
      });
    }

    return res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error("Error fetching tag by slug:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching tag.",
    });
  }
};

// 3. Create New Tag
exports.createTag = async (req, res) => {
  try {
    const { name, description, color, tagType } = req.body;

    // ======================================================
    // 🔥 TAG NAME SANITIZE LOGIC
    // ======================================================

    // remove left/right spaces
    const trimmedName = name?.trim() || "";

    // remove ALL center spaces

    const noSpaceName = trimmedName.replace(/\s+/g, "");
    // full lowercase
    const formattedName = noSpaceName.toLowerCase();
    // ======================================================
    // 🔥 TAG TYPE SANITIZE
    // ======================================================

    const formattedTagType = tagType
      ?.trim()
      ?.replace(/\s+/g, "-")
      ?.toUpperCase();

    // ======================================================
    // 🔥 VALIDATION
    // ======================================================

    // 1. Basic Validation
    if (!formattedName || !formattedTagType) {
      return res.status(400).json({
        success: false,
        message: "Tag name and Tag Type are required",
      });
    }

    // 2. Generate Unique Slug (name + tagType)
    // Example: Krishna + Actor => krishna-actor
    const generatedSlug = slugify(`${formattedName}-${formattedTagType}`, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Check if tag with same name already exists
    const existingTag = await TagsModel.findOne({
      where: { slug: generatedSlug },
    });
    if (existingTag) {
      return res.status(409).json({
        success: false,
        message: `A tag with name '${name}' and type '${tagType}' already exists.`,
      });
    }

    const newTag = await TagsModel.create({
      name: formattedName,
      tagType: formattedTagType,
      slug: generatedSlug, // Inga generated slug-ah store pandrom
      description: description?.trim() || "",
      color,
    });

    return res.status(201).json({
      success: true,
      message: "Tag created successfully",
      data: newTag,
    });
  } catch (error) {
    console.error("Error creating tag:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Duplicate entry: This slug is already taken.",
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while creating tag.",
    });
  }
};

// 4. Update Tag
exports.updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tagType, description, color } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Tag ID is required",
      });
    }

    const tag = await TagsModel.findByPk(id);
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    // 1. Prepare updated values
    const updatedName = name || tag.name;
    const updatedTagType = tagType || tag.tagType;
    let updatedSlug = tag.slug;

    // 2. If name or tagType changes, regenerate the slug
    if (name || tagType) {
      updatedSlug = slugify(`${updatedName} ${updatedTagType}`, {
        lower: true,
        strict: true,
        trim: true,
      });

      // 3. Conflict Check: Intha puthu slug vera yaraachum vachirukkangala?
      // (Except the current tag we are updating)
      const conflictTag = await TagsModel.findOne({
        where: {
          slug: updatedSlug,
          id: { [Op.ne]: id }, // "Not Equal to current ID" - ithu thaan logic
        },
      });

      if (conflictTag) {
        return res.status(409).json({
          success: false,
          message: `Conflict: A tag with name '${updatedName}' and type '${updatedTagType}' already exists.`,
        });
      }
    }

    // 4. Perform Update
    await tag.update({
      name: updatedName,
      tagType: updatedTagType,
      slug: updatedSlug,
      description: description !== undefined ? description : tag.description,
      color: color || tag.color,
    });

    return res.status(200).json({
      success: true,
      message: "Tag updated successfully",
      data: tag,
    });
  } catch (error) {
    console.error("Error updating tag:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Slug conflict detected in database.",
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating tag.",
    });
  }
};

// 5. Delete Tag
exports.deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Tag ID is required",
      });
    }

    // 1. Find the tag
    const tag = await TagsModel.findByPk(id);
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    /* 
       💡 Pro-Tip: Tag ethavathu news-oda link aagi irukanu check pannalaam.
       Oruvelai news-la intha tag irundha, athai delete panna koodathu 
       appadi illa-na antha news-layum ithu remove aagum-nu warning kudukkalam.
    */

    // 2. Delete the tag
    // Sequelize automatic-ah intermediate table (news_tags) la ulla links-ahyum remove pannidum
    await tag.destroy();

    return res.status(200).json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tag:", error);

    // Database-la Foreign Key constraint irundha intha error varum
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete this tag as it is being used by some news articles.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while deleting tag.",
    });
  }
};
