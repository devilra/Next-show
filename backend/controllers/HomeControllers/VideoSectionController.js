// 1. அனைத்து வீடியோக்களையும் பெறுதல் (ADMIN READ)

const VideoSection = require("../../models/HomePage/VideoSection");

exports.getAllVideos = async (req, res) => {
  try {
    const videoList = await VideoSection.findAll({
      order: [["order", "ASC"]],
    });
    return res.status(200).json(videoList);
  } catch (error) {
    console.error("Error fetching video sections:", error);
    return res.status(500).json({ message: "Failed to fetch video sections" });
  }
};

// 5. Active நிலையில் உள்ள வீடியோக்களை மட்டும் பெறுதல் (PUBLIC READ - UI-க்காக)
exports.getActiveVideos = async (req, res) => {
  try {
    const activeVideos = await VideoSection.findAll({
      where: { isActive: true }, // Active-ஆக இருப்பவை மட்டும்
      order: [["order", "ASC"]], // வரிசைப்படி (Order based)
    });

    return res.status(200).json(activeVideos);
  } catch (error) {
    console.error("Error fetching active video sections:", error);
    return res.status(500).json({
      message: "Failed to fetch active videos for UI",
    });
  }
};

// 2. புதிய வீடியோ பேனரை உருவாக்குதல் (CREATE)
exports.createVideoSection = async (req, res) => {
  try {
    // Multer .fields() பயன்படுத்துவதால் req.files-இல் இருந்து டேட்டா எடுக்க வேண்டும்
    if (!req.files || !req.files["bannerImage"]) {
      return res.status(400).json({ message: "Banner image is mandatory" });
    }

    const { title, shortDescription, order, isActive } = req.body;

    // Image data
    const bannerImage = req.files["bannerImage"][0].path;
    const imagePublicId = req.files["bannerImage"][0].filename;

    // Video data (Optional check)
    let videoUrl = null;
    let videoPublicId = null;

    if (req.files["videoUrl"]) {
      videoUrl = req.files["videoUrl"][0].path;
      videoPublicId = req.files["videoUrl"][0].filename;
    }

    const newVideo = await VideoSection.create({
      title,
      bannerImage,
      imagePublicId,
      videoUrl,
      videoPublicId,
      shortDescription,
      order: order || 1,
      isActive: isActive === "true" || isActive === true,
    });

    return res.status(201).json({
      message: "Video Section created successfully",
      data: newVideo,
    });
  } catch (error) {
    console.error("Error creating video section:", error);
    return res.status(500).json({
      message: "Creation failed",
      details: error.message,
    });
  }
};

// 3. வீடியோ பேனரை புதுப்பித்தல் (UPDATE)
exports.updateVideoSection = async (req, res) => {
  const { id } = req.params;
  const { title, shortDescription, order, isActive } = req.body;
  try {
    const videoRecord = await VideoSection.findByPk(id);
    if (!videoRecord) {
      return res.status(404).json({ message: "Video Section Not Found" });
    }

    // புதிய இமேஜ் இருந்தால்
    if (req.files && req.files["bannerImage"]) {
      videoRecord.bannerImage = req.files["bannerImage"][0].path;
      videoRecord.imagePublicId = req.files["bannerImage"][0].filename;
    }
    // புதிய வீடியோ இருந்தால்
    if (req.files && req.files["videoUrl"]) {
      videoRecord.videoUrl = req.files["videoUrl"][0].path;
      videoRecord.videoPublicId = req.files["videoUrl"][0].filename;
    }

    videoRecord.title = title || videoRecord.title;
    videoRecord.shortDescription =
      shortDescription || videoRecord.shortDescription;
    videoRecord.order = order || videoRecord.order;

    if (isActive !== undefined) {
      videoRecord.isActive = isActive === "true" || isActive === true;
    }

    await videoRecord.save();

    return res.status(200).json({
      message: "Video Section updated successfully",
      data: videoRecord,
    });
  } catch (error) {
    console.error("Error updating video section:", error);
    return res.status(500).json({ message: "Update failed" });
  }
};

// 4. நீக்குதல் (DELETE)

exports.deleteVideoSection = async (req, res) => {
  const { id } = req.params;
  try {
    const videoRecord = await VideoSection.findByPk(id);
    if (!videoRecord) {
      return res.status(404).json({ message: "Record Not Found" });
    }

    // Hooks மூலம் Cloudinary-ல் இருந்து தானாக நீக்கப்படும்
    await videoRecord.destroy();

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting record:", error);
    return res.status(500).json({ message: "Deletion failed" });
  }
};
