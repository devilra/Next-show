const slugify = require("slugify");
const moment = require("moment");
const CentralizedMovieCreate = require("../../models/CentralizedMoviesCreateModels/CentralizedMovieCreate");

/**
 * HELPER: Form-data-voda String Boolean-ai Real Boolean-aaga maatra
 */

const parseBool = (value) => value === "true" || value === true;

const getYouTubeID = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * ==========================================
 * 1. PUBLIC READ CONTROLLERS
 * ==========================================
 */

// Oru common helper function to parse movie data
// --------option-1--------
// const parseMovieFields = (movie) => {
//   const data = movie.get({ plain: true }); // Sequelize object-ah plain JSON-ah mathuthu

//   try {
//     // Data string-ah iruntha mattum parse pannu, illana empty array kudu
//     data.language = data.language
//       ? typeof data.language === "string"
//         ? JSON.parse(data.language)
//         : data.language
//       : [];
//     data.genres = data.genres
//       ? typeof data.genres === "string"
//         ? JSON.parse(data.genres)
//         : data.genres
//       : [];

//     // Oru vela parse pannathuku apparamum munnadi mari double-string-ah iruntha (re-parsing)
//     if (typeof data.language === "string")
//       data.language = JSON.parse(data.language);
//     if (typeof data.genres === "string") data.genres = JSON.parse(data.genres);
//   } catch (e) {
//     console.log("Parse Error for movie:", data.title, e);
//     data.language = [];
//     data.genres = [];
//   }

//   return data;
// };

// Oru common helper function to parse movie data
// ----------option-2------------

const parseMovieFields = (movie) => {
  const data = movie.get({ plain: true });

  console.log(data);

  // Parse panna vendiya fields list
  const jsonFields = [
    "language",
    "genres",
    "topCast",
    "mediaLinks",
    "galleryLinks",
  ];

  jsonFields.forEach((field) => {
    try {
      if (data[field]) {
        // Data string-ah irukkira varai thirumba thirumba parse pannu
        while (typeof data[field] === "string") {
          data[field] = JSON.parse(data[field]);
        }
      } else {
        // Oru vela data illana default-ah empty array kudu
        data[field] = [];
      }
    } catch (e) {
      // Intha catch block-la data JSON illatha normal string-ah iruntha filter pannidum
      console.log(`Parse Finished/Error for ${field}:`, e.message);

      // Error vantha (e.g. normal string "Tamil | Hindi") athai array-va mathurathu safety
      if (typeof data[field] === "string") {
        data[field] = [data[field]];
      }
    }
  });

  return data;
};

// @desc    Get New Movies Page (Upcoming & Released)
exports.getNewMoviesPageData = async (req, res) => {
  try {
    const [upcomingRaw, newReleasesRaw] = await Promise.all([
      CentralizedMovieCreate.findAll({
        where: {
          showInNewMovies: true,
          streamType: "UPCOMING",
          isActive: true,
        },
        order: [["order", "ASC"]],
      }),
      CentralizedMovieCreate.findAll({
        where: {
          showInNewMovies: true,
          streamType: "NEW_RELEASE",
          isActive: true,
        },
        order: [["order", "ASC"]],
      }),
    ]);

    const upcoming = upcomingRaw.map(parseMovieFields);
    const newReleases = newReleasesRaw.map(parseMovieFields);

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
    const [upcomingRaw, newReleasesRaw] = await Promise.all([
      CentralizedMovieCreate.findAll({
        where: {
          showInStreamingNow: true,
          streamType: "UPCOMING",
          isActive: true,
        },
        order: [["order", "ASC"]],
      }),
      CentralizedMovieCreate.findAll({
        where: {
          showInStreamingNow: true,
          streamType: "NEW_RELEASE",
          isActive: true,
        },
        order: [["order", "ASC"]],
      }),
    ]);

    // Parse language and genres here
    const upcoming = upcomingRaw.map(parseMovieFields);
    const newReleases = newReleasesRaw.map(parseMovieFields);

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
  console.log("GET MOVIE DETAILS function start");
  try {
    const { slug } = req.params;
    // console.log("Slug", slug);

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

    const parsedData = parseMovieFields(movie);
    // console.log("BACKEND Movie", parsedData);

    // ✨ DATE FORMATTING FUNCTION
    // ✨ UPDATED DATE FORMATTING FUNCTION (Using Moment)
    const formatDate = (dateValue) => {
      console.log("FORMAT DATE INPUT:", dateValue);

      // 1. Check if value is null, undefined or string 'null'
      if (!dateValue || dateValue === "null") return "TBA";

      // 2. Use Moment to parse and validate
      const m = moment(dateValue);

      if (!m.isValid()) {
        return "TBA"; // Valid date illana TBA kuduthudunga
      }

      // 3. Format it as "Apr 22 2026"
      return m.format("MMM DD YYYY");
    };

    // ✨ INGA THAAN CHANGE: Response anupurathuku munnadi parse pannanum
    const processedMovie = {
      ...parsedData,
      releaseDate: formatDate(parsedData.releaseDate),
      theatreReleaseDate: formatDate(parsedData.theatreReleaseDate),
      ottReleaseDate: formatDate(parsedData.ottReleaseDate),
    };

    console.log("PROCESS MOVIE", processedMovie);

    res.status(200).json({ success: true, data: processedMovie });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
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

// @desc    Get Home Page All Sections
exports.getHomePageData = async (req, res) => {
  try {
    const [upcomingRaw, newReleasesRaw] = await Promise.all([
      CentralizedMovieCreate.findAll({
        where: {
          showInHomepage: true,
          streamType: "UPCOMING",
          isActive: true,
        },
        order: [["order", "ASC"]],
      }),
      CentralizedMovieCreate.findAll({
        where: {
          showInHomepage: true,
          streamType: "NEW_RELEASE",
          isActive: true,
        },
        order: [["order", "ASC"]],
      }),
      // CentralizedMovieCreate.findAll({
      //   where: {
      //     showInHomeStreaming: true,
      //     isActive: true,
      //   },
      //   order: [["order", "ASC"]],
      // }),
    ]);

    // Clean data using your parseMovieFields helper
    const upcoming = upcomingRaw.map(parseMovieFields);
    const newReleases = newReleasesRaw.map(parseMovieFields);
    // const streaming = streamingRaw.map(parseMovieFields);

    res.status(200).json({
      success: true,
      data: { upcoming, newReleases },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching Home data" });
  }
};

// @desc    Create Movie (All 35+ Fields)
exports.createMovie = async (req, res) => {
  try {
    const { title, galleryLinks } = req.body;
    // console.log(req.body);

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

    // 📸 Process Gallery Links (Full URL to ID)
    let processedGalleryIds = [];

    if (galleryLinks) {
      // Form-data-la irunthu varum pothu string-ah iruntha parse pannanum
      const linksArray =
        typeof galleryLinks === "string"
          ? JSON.parse(galleryLinks)
          : galleryLinks;

      processedGalleryIds = linksArray
        .map((link) => getYouTubeID(link))
        .filter((id) => id !== null);
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

      // ✅ PUTHU FIELDS INGA ADD PANNUNGA
      showInHomepage: parseBool(req.body.showInHomepage),
      // showInHomeTrending: parseBool(req.body.showInHomeTrending),
      // showInHomeStreaming: parseBool(req.body.showInHomeStreaming),
      isTrending: parseBool(req.body.isTrending),
      isActive: parseBool(req.body.isActive ?? true),
      // Numeric handling
      imdbRating: parseFloat(req.body.imdbRating || 0),
      userRating: parseFloat(req.body.userRating || 0),
      ratingCount: parseInt(req.body.ratingCount || 0),
      viewCount: parseInt(req.body.viewCount || 0),
      order: parseInt(req.body.order || 1),
      // 🆕 Gallery Storage
      galleryLinks: processedGalleryIds,
    });

    // console.log(newMovie);
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

    console.log("UPDATE DATA", updateData);

    // 📸 Update Gallery Links if provided
    if (updateData.galleryLinks) {
      const linksArray =
        typeof updateData.galleryLinks === "string"
          ? JSON.parse(updateData.galleryLinks)
          : updateData.galleryLinks;

      updateData.galleryLinks = linksArray
        .map((link) => (link.includes("youtu") ? getYouTubeID(link) : link)) // Puthu link-na ID edukkum, already ID-ah iruntha tholla pannathu
        .filter((id) => id !== null);
    }

    // If new image is uploaded
    // If new image is uploaded
    if (req.files && req.files["bannerImage"]) {
      updateData.bannerImage = req.files["bannerImage"][0].path;
      updateData.imagePublicId = req.files["bannerImage"][0].filename;
    }

    // --- NEW DATE HANDLING LOGIC ---

    const dateFields = [
      "releaseDate",
      "theatreReleaseDate",
      "ottReleaseDate",
      "trendingStartDate",
    ];

    dateFields.forEach((field) => {
      // 'null' string-ah vanthalum illai empty-ah vanthalum real null-ah mathidum
      if (
        updateData[field] === "null" ||
        updateData[field] === "" ||
        updateData[field] === undefined
      ) {
        updateData[field] = null;
      } else {
        // Valid date-ah nu check panni handle pannum
        const mDate = moment(updateData[field]);
        updateData[field] = mDate.isValid() ? mDate.toDate() : null;
      }
    });

    // Ensuring correct data types
    const booleanFields = [
      "showInNewMovies",
      "showInStreamingNow",
      "isTrending",
      "isActive",
      "showInHomepage", // Added
      // "showInHomeTrending", // Added
      // "showInHomeStreaming", // Added
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
    res.status(500).json({ success: false, message: error.message });
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
