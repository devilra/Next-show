const slugify = require("slugify");
const CentralizedMovieCreate = require("../../models/CentralizedMoviesCreateModels/CentralizedMovieCreate");

/**
 * HELPER: Form-data-voda String Boolean-ai Real Boolean-aaga maatra
 */

const parseBool = (value) => value === "true" || value === true;

/**
 * ==========================================
 * 1. PUBLIC READ CONTROLLERS
 * ==========================================
 */

// @desc    Get New Movies Page (Upcoming & Released)
exports.getNewMoviesPageData = async (req, res) => {
  try {
    const [upcoming, newReleases] = await Promise.all([
      CentralizedMovieCreate.findAll({
        where: {
          showInNewMovies: true,
          status: "UPCOMING",
          isActive: true,
        },
        order: [["order", "ASC"]],
      }),
      CentralizedMovieCreate.findAll({
        where: {
          showInNewMovies: true,
          status: "RELEASED",
          isActive: true,
        },
        order: [["order", "ASC"]],
      }),
    ]);

    // Check if both lists are empty
    if (upcoming.length === 0 && newReleases.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No movies found in New Movies section",
        data: { upcoming: [], newReleases: [] },
      });
    }

    res.status(200).json({ success: true, data: { upcoming, newReleases } });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching New Movies data" });
  }
};

// @desc    Get Streaming Page (Trending & OTT Upcoming)

exports.getStreamingNowPageData = async (req, res) => {
  try {
    const [upcoming, newReleases] = await Promise.all([
      CentralizedMovieCreate.findAll({
        where: {
          showInStreamingNow: true,
          status: "UPCOMING",
          isActive: true,
        },
        order: [["order", "ASC"]],
      }),
      CentralizedMovieCreate.findAll({
        where: {
          showInStreamingNow: true,
          status: "RELEASED",
          isActive: true,
        },
        order: [["order", "ASC"]],
      }),
    ]);

    // Check if both lists are empty
    if (upcoming.length === 0 && newReleases.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No movies found in Streaming section",
        data: { upcoming: [], newReleases: [] },
      });
    }

    res.status(200).json({ success: true, data: { upcoming, newReleases } });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching Streaming data" });
  }
};

// @desc    Get Full Movie Details by Slug
exports.getMovieDetailsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const movie = await CentralizedMovieCreate.findOne({
      where: {
        slug,
        isActive: true,
      },
    });

    if (!movie)
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });

    // Atomic increment for popularity tracking
    await movie.increment("viewCount");

    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * ==========================================
 * 2. ADMIN CRUD CONTROLLERS (ALL KEYS INCLUDED)
 * ==========================================
 */

// @desc    Admin Read All
exports.getAllMoviesAdmin = async (req, res) => {
  try {
    const list = await CentralizedMovieCreate.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// @desc    Create Movie (All 35+ Fields)
exports.createMovie = async (req, res) => {
  try {
    const { title } = req.body;

    console.log(req.body);
    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Title is mandatory" });

    // Banner image check
    if (!req.files || !req.files["bannerImage"]) {
      return res
        .status(400)
        .json({ success: false, message: "Banner image is mandatory" });
    }

    // Automatic slug with timestamp to avoid duplicates

    const movieSlug = `${slugify(title, {
      lower: true,
      strict: true,
    })}-${Date.now().toString().slice(-4)}`;

    const newMovie = await CentralizedMovieCreate.create({
      ...req.body,
      slug: movieSlug,
      bannerImage: req.files["bannerImage"][0].path,
      imagePublicId: req.files["bannerImage"][0].filename,
      // Boolean handling
      showInNewMovies: parseBool(req.body.showInNewMovies),
      showInStreamingNow: parseBool(req.body.showInStreamingNow),
      isTrending: parseBool(req.body.isTrending),
      isActive: parseBool(req.body.isActive ?? true),
      // Numeric handling
      imdbRating: parseFloat(req.body.imdbRating || 0),
      userRating: parseFloat(req.body.userRating || 0),
      ratingCount: parseInt(req.body.ratingCount || 0),
      viewCount: parseInt(req.body.viewCount || 0),
      order: parseInt(req.body.order || 1),
    });
    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: newMovie,
    });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ success: false, message: "Failed to create movie" });
  }
};

// @desc    Update Movie (Dynamic Field Update)
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await CentralizedMovieCreate.findByPk(id);
    if (!movie)
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });

    let updateData = { ...req.body };

    // If new image is uploaded
    // If new image is uploaded
    if (req.files && req.files["bannerImage"]) {
      updateData.bannerImage = req.files["bannerImage"][0].path;
      updateData.imagePublicId = req.files["bannerImage"][0].filename;
    }

    // Ensuring correct data types
    const booleanFields = [
      "showInNewMovies",
      "showInStreamingNow",
      "isTrending",
      "isActive",
    ];
    booleanFields.forEach((field) => {
      if (updateData[field] !== undefined)
        updateData[field] = parseBool(updateData[field]);
    });

    const numericFields = [
      "imdbRating",
      "userRating",
      "ratingCount",
      "viewCount",
      "order",
    ];
    numericFields.forEach((field) => {
      if (updateData[field] !== undefined)
        updateData[field] = parseFloat(updateData[field]);
    });

    await movie.update(updateData);
    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: movie,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Failed to update movie" });
  }
};

// @desc    Delete Movie
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await CentralizedMovieCreate.findByPk(req.params.id);
    if (!movie)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });

    await movie.destroy(); // Hooks will handle Cloudinary deletion
    res
      .status(200)
      .json({ success: true, message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
};
