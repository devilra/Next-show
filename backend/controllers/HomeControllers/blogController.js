const BlogsSchema = require("../../models/HomePage/BlogsSection");

// 1. Get All Blogs (ADMIN READ)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogList = await BlogsSchema.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: blogList.length,
      data: blogList,
    });
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching blogs.",
    });
  }
};


// 2. Get Single Blog Detail
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    const blog = await BlogsSchema.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "The movie news you are looking for does not exist.",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog detail:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while loading the details.",
    });
  }
};


// 3. Get Active Blogs (PUBLIC)
exports.getActiveBlogs = async (req, res) => {
  try {
    const activeBlogs = await BlogsSchema.findAll({
      where: { isActive: true },
      order: [["order", "ASC"], ["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: activeBlogs,
    });
  } catch (error) {
    console.error("Error fetching active blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load latest movie news.",
    });
  }
};


// 4. Create Blog
exports.createBlog = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Banner image is required.",
      });
    }

    const {
      title,
      shortDescription,
      longDescription,
      starCast,
      directedBy,
      producedBy,
      cinematography,
      newsDate,
      isActive,
      order,
    } = req.body;

    if (!title?.trim() || !shortDescription?.trim() || !directedBy?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide Title, Short Description, and Director name.",
      });
    }

    const newBlog = await BlogsSchema.create({
      title: title.trim(),
      bannerImage: req.file.path,
      imagePublicId: req.file.filename,
      shortDescription: shortDescription.trim(),
      longDescription,
      starCast,
      directedBy: directedBy.trim(),
      producedBy,
      cinematography,
      newsDate,
      order: Number(order) || 1,
      isActive: isActive === undefined ? true : (String(isActive) === "true"),
    });

    return res.status(201).json({
      success: true,
      message: "New movie news added successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 5. Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const blog = await BlogsSchema.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Image update
    if (req.file) {
      blog.bannerImage = req.file.path;
      blog.imagePublicId = req.file.filename;
    }

    // Update fields
    Object.keys(updateData).forEach((key) => {
      if (key === "isActive") {
        blog.isActive = String(updateData[key]) === "true";
      } else if (key === "order") {
        blog.order = Number(updateData[key]) || blog.order;
      } else if (
        updateData[key] !== undefined &&
        updateData[key] !== "null" &&
        updateData[key] !== ""
      ) {
        blog[key] = updateData[key];
      }
    });

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};


// 6. Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await BlogsSchema.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await blog.destroy();

    return res.status(200).json({
      success: true,
      message: "Blog and associated image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({
      success: false,
      message: "Deletion failed",
      error: error.message,
    });
  }
};