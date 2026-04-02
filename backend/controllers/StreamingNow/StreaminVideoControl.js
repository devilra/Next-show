// 1. அனைத்து வீடியோக்களையும் பெறுதல் (ADMIN READ)
// தரவு இல்லை என்றால் 404 அனுப்பாமல் 200 உடன் Empty Array அனுப்புவதே சிறந்தது (Standard Practice).

const StreamingNow = require("../../models/StreamingNow/StreamingVideo");

exports.getAllStreamingContent = async (req, res) => {
  try {
    const list = await StreamingNow.findAll({
      order: [["order", "ASC"]],
    });

    if (!list || list.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No streaming content found in the database",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    console.error("Error fetching streaming content:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// 2. Active நிலையில் உள்ளவற்றை மட்டும் பெறுதல் (PUBLIC READ)
exports.getActiveStreamingContent = async (req, res) => {
  try {
    const activeList = await StreamingNow.findAll({
      where: {
        isActive: true,
      },
      order: [["order", "ASC"]],
    });

    if (!activeList || activeList.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No active content available at the moment",
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      data: activeList,
    });
  } catch (error) {
    console.error("Error fetching active content:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// 3. புதிய ஸ்ட்ரீமிங் வீடியோவை உருவாக்குதல் (CREATE)
exports.createStreamingNow = async (req, res) => {
  try {
    // Validation: Title மற்றும் Banner Image கட்டாயம்
    const { title } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }
    if (!req.files || !req.files["bannerImage"]) {
      return res
        .status(400)
        .json({ success: false, message: "Banner image is mandatory" });
    }

    const {
      releaseYear,
      certification,
      durationOrSeason,
      language,
      genres,
      longDescription,
      order,
      isActive,
    } = req.body;

    // File Data extraction
    const bannerImage = req.files["bannerImage"][0].path;
    const imagePublicId = req.files["bannerImage"][0].filename;

    let videoUrl = null;
    let videoPublicId = null;

    if (req.files["videoUrl"]) {
      videoUrl = req.files["videoUrl"][0].path;
      videoPublicId = req.files["videoUrl"][0].filename;
    }

    const newItem = await StreamingNow.create({
      title,
      releaseYear,
      certification,
      durationOrSeason,
      language,
      genres,
      longDescription,
      bannerImage,
      imagePublicId,
      videoUrl,
      videoPublicId,
      order: order || 1,
      isActive: isActive === "true" || isActive === true,
    });

    return res.status(201).json({
      success: true,
      message: "Streaming content published successfully",
      data: newItem,
    });
  } catch (error) {
    console.error("Error creating content:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create content" });
  }
};

// 4. விவரங்களை புதுப்பித்தல் (UPDATE)
exports.updateStreamingNow = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await StreamingNow.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Content not found with the provided ID",
      });
    }

    const updateData = req.body;

    // Handle File Updates
    if (req.files) {
      if (req.files["bannerImage"]) {
        record.bannerImage = req.files["bannerImage"][0].path;
        record.imagePublicId = req.files["bannerImage"][0].filename;
      }

      if (req.files["videoUrl"]) {
        record.videoUrl = req.files["videoUrl"][0].path;
        record.videoPublicId = req.files["videoUrl"][0].filename;
      }
    }

    // Dynamic Field Updates
    const fields = [
      "title",
      "releaseYear",
      "certification",
      "durationOrSeason",
      "language",
      "genres",
      "longDescription",
      "order",
    ];

    fields.forEach((field) => {
      if (updateData[field] !== undefined) record[field] = updateData[field];
    });

    if (updateData.isActive !== undefined) {
      record.isActive =
        updateData.isActive === "true" || updateData.isActive === true;
    }
    await record.save();
    return res.status(200).json({
      success: true,
      message: "Streaming content updated successfully",
      data: record,
    });
  } catch (error) {
    console.error("Error updating content:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal update failure" });
  }
};

// 5. நீக்குதல் (DELETE)
exports.deleteStreamingNow = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await StreamingNow.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record already deleted or not found",
      });
    }

    // Cloudinary Cleanup is handled by Sequelize Hooks in Model
    await record.destroy();

    return res.status(200).json({
      success: true,
      message: "Streaming content and associated files deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting record:", error);
    return res.status(500).json({ success: false, message: "Deletion failed" });
  }
};
