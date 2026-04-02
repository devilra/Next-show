const NewTrailer = require("../../models/HomePage/NewTrailers");

const parseBool = (value) => value === "true" || value === true;

// YouTube URL சரியானதா என்று செக் செய்யும் பங்க்ஷன்
const isValidYouTubeUrl = (url) => {
  const regExp = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return regExp.test(url);
};

// -----------------------------------------------------------
// 1. PUBLIC CONTROLLER (Frontend UI-க்காக)
// -----------------------------------------------------------

// @desc    Get Active Trailers for Frontend UI
// @route   GET /api/trailers/active

exports.getActiveTrailers = async (req, res) => {
  try {
    // UI-ல் isActive: true என இருக்கும் வீடியோக்கள் மட்டும் வரிசைப்படி (Order) வரும்
    const trailers = await NewTrailer.findAll({
      where: {
        isActive: true,
      },
      order: [["order", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: trailers.length,
      data: trailers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching active trailers" });
  }
};

// -----------------------------------------------------------
// 2. ADMIN CONTROLLERS (Admin Panel CRUD)
// -----------------------------------------------------------

// @desc    Get All Trailers for Admin Table (Both Active & Inactive)
// @route   GET /api/admin/trailers
exports.getAllTrailersAdmin = async (req, res) => {
  try {
    // அட்மின் பேனலில் அனைத்து ட்ரெய்லர்களும் (Active/Inactive) தெரிய வேண்டும்
    const trailers = await NewTrailer.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: trailers.length,
      data: trailers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching all trailers" });
  }
};

// @desc    Create New Trailer
// @route   POST /api/admin/trailers

exports.createTrailer = async (req, res) => {
  try {
    const {
      movieName,
      videoTitle,
      trailerUrl,
      order,
      isActive,
      postedTimeDisplay,
    } = req.body;

    if (!movieName || !trailerUrl) {
      return res.status(400).json({
        success: false,
        message: "Movie Name and Trailer URL are mandatory",
      });
    }

    // ✨ ஆட்டோமேட்டிக் லாஜிக்:
    // பிரண்ட் எண்டில் இருந்து postedTimeDisplay வரவில்லை என்றால்,
    // டீஃபால்ட்டாக "Just now" என எடுத்துக்கொள்ளும்.

    const finalPostedTime = postedTimeDisplay || "Just now";

    const newTrailer = await NewTrailer.create({
      movieName,
      videoTitle,
      trailerUrl,
      postedTimeDisplay: finalPostedTime,
      order: parseInt(order || 1),
      isActive: parseBool(isActive ?? true),
    });

    res.status(201).json({
      success: true,
      message: "Trailer added successfully",
      data: newTrailer,
    });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ success: false, message: "Failed to add trailer" });
  }
};

exports.updateTrailer = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. முதலில் டேட்டா இருக்கிறதா என்று பார்க்கிறோம்
    const trailer = await NewTrailer.findByPk(id);
    if (!trailer) {
      return res
        .status(404)
        .json({ success: false, message: "Trailer not found" });
    }

    // 2. req.body-யிலிருந்து வரும் தரவுகளை எடுக்கிறோம்
    const {
      movieName,
      videoTitle,
      trailerUrl,
      postedTimeDisplay,
      order,
      isActive,
    } = req.body;

    // 3. அப்டேட் செய்ய வேண்டிய டேட்டாவை மட்டும் ஒரு ஆப்ஜெக்ட்டில் சேர்க்கிறோம்
    let updateFields = {};

    if (movieName !== undefined) updateFields.movieName = movieName.trim();
    if (videoTitle !== undefined) updateFields.videoTitle = videoTitle.trim();

    // YouTube URL Validation (நாங்கள் ஏற்கனவே பார்த்தது போல)
    if (trailerUrl !== undefined) {
      if (!isValidYouTubeUrl(trailerUrl)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid YouTube URL" });
      }
      updateFields.trailerUrl = trailerUrl.trim();
    }

    if (postedTimeDisplay !== undefined)
      updateFields.postedTimeDisplay = postedTimeDisplay;
    if (order !== undefined) updateFields.order = parseInt(order) || 0;
    if (isActive !== undefined) updateFields.isActive = parseBool(isActive);

    // 4. இப்போது குறிப்பிட்ட ஃபீல்டுகளை மட்டும் அப்டேட் செய்கிறோம்
    // இது மற்ற பழைய ஃபீல்டுகளை எக்காரணம் கொண்டும் தொடாது (Safe Update)
    await trailer.update(updateFields);

    res.status(200).json({
      success: true,
      message: "Trailer updated successfully",
      data: trailer,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update trailer" });
  }
};

exports.deleteTrailer = async (req, res) => {
  try {
    const trailer = await NewTrailer.findByPk(req.params.id);
    if (!trailer) {
      return res
        .status(404)
        .json({ success: false, message: "Trailer not found" });
    }

    await trailer.destroy();
    res
      .status(200)
      .json({ success: true, message: "Trailer deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
};
