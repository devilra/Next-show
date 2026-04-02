const HomeStreamingNow = require("../../models/HomePage/HomeStreamingNow");

// 1. அனைத்து உள்ளடக்கங்களையும் பெறுதல் (ADMIN READ)
exports.getAllHomeStreaming = async (req, res) => {
  try {
    const list = await HomeStreamingNow.findAll({
      order: [["order", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list || [],
    });
  } catch (error) {
    console.error("Error fetching all home streaming content:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// 2. ஆக்டிவாக உள்ளவற்றை மட்டும் பெறுதல் (PUBLIC READ)
exports.getActiveHomeStreaming = async (req, res) => {
  try {
    const activeList = await HomeStreamingNow.findAll({
      where: { isActive: true },
      order: [["order", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      data: activeList || [],
    });
  } catch (error) {
    console.error("Error fetching active home streaming content:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// 3. புதிய உள்ளடக்கத்தை உருவாக்குதல் (CREATE)
exports.createHomeStreaming = async (req, res) => {
  try {
    const { title, streamType } = req.body;

    // அடிப்படை சரிபார்ப்பு
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    // Stream Type சரிபார்ப்பு
    const validTypes = ["TRENDING", "UPCOMING", "NEW"];
    if (streamType && !validTypes.includes(streamType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Stream Type. Use TRENDING, UPCOMING, or NEW",
      });
    }

    if (!req.files || !req.files["bannerImage"]) {
      return res
        .status(400)
        .json({ success: false, message: "Banner image is mandatory" });
    }

    const {
      director,
      cast,
      releaseDate, // Front-end-லிருந்து வரும் String (DD-MM-YYYY)
      certification,
      durationOrSeason,
      language,
      genres,
      longDescription,
      order,
      isActive,
    } = req.body;

    // Cloudinary File Data
    const bannerImage = req.files["bannerImage"][0].path;
    const imagePublicId = req.files["bannerImage"][0].filename;

    const newItem = await HomeStreamingNow.create({
      title,
      streamType: streamType || "NEW", // டீஃபால்ட் NEW
      director,
      cast,
      releaseDate,
      certification,
      durationOrSeason,
      language,
      genres,
      longDescription,
      bannerImage,
      imagePublicId,
      order: order || 1,
      isActive: isActive === "true" || isActive === true,
    });

    return res.status(201).json({
      success: true,
      message: "Home streaming content created successfully",
      data: newItem,
    });
  } catch (error) {
    console.error("Error creating home streaming content:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create content" });
  }
};

// 4. விவரங்களை புதுப்பித்தல் (UPDATE)
exports.updateHomeStreaming = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await HomeStreamingNow.findByPk(id);

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Content not found" });
    }

    const updateData = req.body;

    // இமேஜ் அப்டேட் இருந்தால் மட்டும்
    if (req.files && req.files["bannerImage"]) {
      record.bannerImage = req.files["bannerImage"][0].path;
      record.imagePublicId = req.files["bannerImage"][0].filename;
    }

    // அனைத்து ஃபீல்டுகளையும் டைனமிக்காக அப்டேட் செய்தல்
    const fieldsToUpdate = [
      "title",
      "streamType",
      "director",
      "cast",
      "releaseDate",
      "certification",
      "durationOrSeason",
      "language",
      "genres",
      "longDescription",
      "order",
    ];

    fieldsToUpdate.forEach((field) => {
      if (updateData[field] !== undefined) {
        record[field] = updateData[field];
      }
    });

    // Boolean ஃபீல்டை சரியாக கையாளுதல்
    if (updateData.isActive !== undefined) {
      record.isActive =
        updateData.isActive === "true" || updateData.isActive === true;
    }

    await record.save();

    return res.status(200).json({
      success: true,
      message: "Home streaming content updated successfully",
      data: record,
    });
  } catch (error) {
    console.error("Error updating home streaming content:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal update failure" });
  }
};

// 5. நீக்குதல் (DELETE)
exports.deleteHomeStreaming = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await HomeStreamingNow.findByPk(id);

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    // Cloudinary Cleanup-ஐ மாடல் ஹூக்ஸ் (Hooks) கவனித்துக்கொள்ளும்
    await record.destroy();

    return res.status(200).json({
      success: true,
      message: "Content and associated banner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting record:", error);
    return res.status(500).json({ success: false, message: "Deletion failed" });
  }
};
