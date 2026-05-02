const slugify = require("slugify");
const { Op } = require("sequelize"); // Sequelize Operators import pannunga
const CentralizedJsonBulkCreate = require("../../models/CentralizedMoviesCreateModels/CentralizedJsonBulkCreate");
const DeletedMovies = require("../../models/DeletedRestoreMovies/DeletedMovies");
const sequelize = require("../../config/db");
const { cloudinary } = require("../../config/cloudinaryConfig");
const moment = require("moment");
const MovieCast = require("../../models/CentralizedMoviesCreateModels/MovieCast");
const { Cast } = require("../../models/associationIndex");

exports.CentralizedCreateMovie = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let moviesData = req.body;
    if (!Array.isArray(moviesData)) {
      moviesData = [moviesData];
    }

    // console.log("MoviesData", moviesData);

    const createdMovies = [];
    const now = new Date();

    for (const movie of moviesData) {
      const {
        title,
        theatreReleaseDate,
        ottReleaseDate,
        trailerUrl,
        streamType,
        releaseMode,
        castDetails,
        movieStatus,
        ...rest
      } = movie;

      // 1. DATA CLEANING (Normalize)
      // Title-la munnadi pinna irukura white-spaces ah remove panrom
      const cleanTitle = title.trim();
      // 2. ADVANCED DUPLICATE CHECK
      // Title (case insensitive) OR Trailer URL check panrom
      const existingMovie = await CentralizedJsonBulkCreate.findOne({
        where: {
          [Op.or]: [
            { title: { [Op.like]: cleanTitle } }, //MySQL na Like
            { trailerUrl: trailerUrl }, // Trailer URL unique identity-ah use panrom
          ],
        },
        transaction: t,
      });

      if (existingMovie) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `"${cleanTitle}" Movie and Trailer  already exists!`,
        });
      }

      // 3. SLUG GENERATION
      const baseSlug = slugify(cleanTitle, {
        lower: true,
        strict: true,
      });

      const movieSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      // --- UPDATED LOGIC START ---
      let currentStatus; // Default Initial Status
      let currentStreamType = streamType || "UPCOMING";
      let isTheatreReleased = false;
      let isStreamingReleased = false;
      let currentReleaseMode = releaseMode || "THEATRICAL";

      // 🛑 PRIORITY CHECK: Manual Update ah iruntha data-va apdiye force pannanum

      if (movie.isManualUpdate === true) {
        currentStatus = "RELEASED";
        currentStreamType = streamType || "NEW_RELEASE";
        isTheatreReleased = movie.isTheatreReleased || false;
        isStreamingReleased = movie.isStreamingReleased || false;
        currentReleaseMode = releaseMode || "THEATRICAL";

        // Manual update-la isTrending true-na current date-ah trending start date-ah set panna nalla irukum
        if (movie.isTrending && !movie.trendingStartDate) {
          movie.trendingStartDate = new Date();
        }
      } else {
        const theatreDate = theatreReleaseDate
          ? new Date(theatreReleaseDate)
          : null;
        const ottDate = ottReleaseDate ? new Date(ottReleaseDate) : null;

        // 1. Theatre Release Check (Upload pannum pothe time cross aagi iruntha)
        if (theatreDate && theatreDate <= now) {
          currentStatus = "RELEASED";
          currentStreamType = "NEW_RELEASE";
          isTheatreReleased = true;
          currentReleaseMode = "THEATRICAL";
        }

        // 2. OTT Release Check (Upload pannum pothe OTT time cross aagi iruntha)

        if (ottDate && ottDate <= now) {
          currentStatus = "RELEASED";
          currentStreamType = "NEW_RELEASE";
          isStreamingReleased = true;
          currentReleaseMode = "DIRECT_STREAMING"; // OTT thaan latest release-na mode mathurom
        }
      }

      // 5. DB INSERT
      const newMovie = await CentralizedJsonBulkCreate.create(
        {
          ...rest,
          title: cleanTitle,
          theatreReleaseDate,
          ottReleaseDate,
          trailerUrl,
          slug: movieSlug,
          castDetails: castDetails,
          movieStatus: currentStatus,
          streamType: currentStreamType,
          isTheatreReleased: isTheatreReleased,
          isStreamingReleased: isStreamingReleased,
          releaseMode: currentReleaseMode,
          trendingStartDate: movie.trendingStartDate || rest.trendingStartDate,
        },
        { transaction: t },
      );

      // 4. ✨ MOVIE CAST INSERT LOGIC ✨
      if (castDetails && Array.isArray(castDetails) && castDetails.length > 0) {
        // const castDataWithMovieId = castDetails.map((cast) => ({
        //   movieId: newMovie.id,
        //   castId: cast.castId,
        //   characterName: cast.characterName,
        //   roleCategory: cast.roleCategory,
        //   isLeadRole: cast.isLeadRole || false,
        // }));

        // await MovieCast.bulkCreate(castDataWithMovieId, { transaction: t });
        await MovieCast.create(
          {
            movieId: newMovie.id,
            movieName: cleanTitle,
            castDetails: castDetails, // JSON array-ah appadiye store aagum
          },
          { transaction: t },
        );
      }

      createdMovies.push(newMovie);
    }

    await t.commit(); // Ella operations success na commit pannu

    return res.status(201).json({
      success: true,
      message: `${createdMovies.length} movie(s) published!`,
      data: createdMovies,
    });
  } catch (error) {
    if (t) await t.rollback(); // Error vantha cancel pannu
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Fetch ALL movie data for Admin Dashboard (No filters, Full Object)
 * @route   GET /api/v1/movies/admin/all
 * @access  Private/Admin
 */

exports.GetAllCentralizedJsonMovies = async (req, res) => {
  try {
    // 1. Database Query - Fetching everything without attribute restrictions
    const movies = await CentralizedJsonBulkCreate.findAll({
      order: [["createdAt", "DESC"]],
    });

    // 2. Data Validation - Check if DB is empty
    if (!movies || movies.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No movies found in the database",
        count: 0,
        data: [],
      });
    }

    // 2. Data Transformation (Parsing Strings to JSON Objects)
    // Sequelize instances-ah plain objects-ah mathittu, JSON fields-ah parse panrom

    const parsedMovies = movies.map((movieInstance) => {
      const movie = movieInstance.get({ plain: true });

      // Intha list-la ulla fields string-ah iruntha parse pannum
      const jsonFields = [
        "language",
        "availableOn",
        "genres",
        "mediaLinks",
        "galleryLinks",
        "boxOffice",
        "releaseInfo",
        "streamReleaseInfo",
      ];

      jsonFields.forEach((field) => {
        if (movie[field] && typeof movie[field] === "string") {
          try {
            movie[field] = JSON.parse(movie[field]);
          } catch (error) {
            console.warn(
              `Could not parse field ${field} for movie id ${movie.id}`,
            );
            // Parse panna mudiyala na default empty values set pannikalam
          }
        }
      });

      return movie;
    });

    // 3. Success Response - Returning full JSON objects for each movie
    return res.status(200).json({
      success: true,
      message: "All movies retrieved successfully",
      count: parsedMovies.length,
      data: parsedMovies,
    });
  } catch (error) {
    // 4. Detailed Error Logging for Enterprise debugging
    console.error(`[ADMIN_FETCH_ERROR] - ${new Date().toISOString()}:`, {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the movie list",
      // Production-la full error details-ah hide pannurom security-kaga
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal Server Error",
    });
  }
};

/**
 * @desc    Get Single Movie Details by Slug
 * @route   GET /api/v1/movies/details/:slug
 * @access  Public/Admin
 */

exports.GetMovieAdminDetailsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1. Database-la slug base panni search panrom
    const movieInstance = await CentralizedJsonBulkCreate.findOne({
      where: {
        slug: slug,
      },
      include: [
        {
          model: MovieCast,
          as: "organizedCast", // Neenga association-la kudutha 'as' name
        },
      ],
    });

    // console.log("movieInstance", movieInstance);

    // 2. Movie illai na error return panrom
    if (!movieInstance) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // 3. Plain Object-ah mathurom
    const movie = movieInstance.get({ plain: true });

    // console.log(movie);

    // ✨ Logic to merge castDetails into the main response
    if (movie.organizedCast && movie.organizedCast.castDetails) {
      let rawCastArray = movie.organizedCast.castDetails;

      // JSON string-ah vantha parse panrom
      if (typeof rawCastArray === "string") {
        try {
          rawCastArray = JSON.parse(rawCastArray);
        } catch (e) {
          rawCastArray = [];
        }
      }

      // JSON array-la irukkura ellaa castId-ayum extract panrom
      const castIds = rawCastArray.map((c) => c.castId);

      // console.log("castId", castIds);

      // Cast table-la irunthu antha IDs-ku mattum details fetch panrom
      const castInfos = await Cast.findAll({
        where: {
          id: {
            [Op.in]: castIds,
          },
        },
        attributes: ["id", "name", "profileImage", "gender"],
      });

      // Data-va merge panrom: JSON array + DB Cast Info
      movie.castDetails = rawCastArray.map((item) => {
        const info = castInfos.find((actor) => actor.id === item.castId);
        return {
          ...item,
          name: info ? info.name : "Unknown Actor",
          profileImage: info ? info.profileImage : null,
          gender: info ? info.gender : null,
        };
      });

      delete movie.organizedCast; // Response clean-ah irukka ithai remove panrom
    } else {
      movie.castDetails = [];
    }

    // --- ✨ DATE FORMATTING LOGIC START ---
    const formatDate = (dateValue) => {
      // 1. Check if value is null, undefined or string 'null'
      if (!dateValue || dateValue === "null") return "TBA";

      // 2. Use Moment to parse and validate
      const m = moment(dateValue);

      if (!m.isValid()) {
        return "TBA"; // Valid date illana TBA
      }

      // 3. Format it as "Apr 22 2026"
      return m.format("MMM DD YYYY");
    };

    // Release dates-ai format panrom
    movie.releaseDate = formatDate(movie.releaseDate);
    movie.theatreReleaseDate = formatDate(movie.theatreReleaseDate);
    movie.ottReleaseDate = formatDate(movie.ottReleaseDate);

    // 4. JSON Strings-ah proper Objects/Arrays-ah mathurom (Parsing)
    const jsonFields = [
      "language",
      "availableOn",
      "genres",
      "mediaLinks",
      "galleryLinks",
      "boxOffice",
      "releaseInfo",
      "streamReleaseInfo",
    ];

    jsonFields.forEach((field) => {
      if (movie[field] && typeof movie[field] === "string") {
        try {
          movie[field] = JSON.parse(movie[field]);
        } catch (error) {
          console.warn(`Parsing failed for field: ${field}`);
          // parse error vantha current string-aye maintain pannum illa na empty object tharalam
        }
      }
    });

    // 5. Success Response
    return res.status(200).json({
      success: true,
      message: "Movie details retrieved successfully",
      data: movie,
    });
  } catch (error) {
    console.error(`[SINGLE_MOVIE_FETCH_ERROR]:`, error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.CentralizedJsonDeleteMovie = async (req, res) => {
  const { id } = req.params;
  const { reason, adminName } = req.body;

  // 1. Transaction-ai start pannunga
  const t = await sequelize.transaction();

  try {
    // 1. Main table-la irunthu movie-ai kandupidi
    const movie = await CentralizedJsonBulkCreate.findByPk(id, {
      transaction: t,
    });

    if (!movie) {
      await t.rollback();
      return res.status(404).json({ message: "Movie not found" });
    }

    // 2. Movie data-vai JSON-ah mathi, extra trash fields add pannu
    const movieData = movie.toJSON();

    // Trash table-oda ID autoIncrement aagum, so original ID-ai remove pannidunga
    delete movieData.id;

    // 3. DeletedMovies table-la record create pannu
    await DeletedMovies.create(
      {
        ...movieData,
        originalId: movie.id, // Future restoration-ku help-ah irukkum
        deletedBy: adminName || "System Admin",
        deletionReason: reason || "No reason specified",
        deletedAt: new Date(),
      },
      { transaction: t },
    );

    /**
     * 4. Ippo main table-la irunthu record-ai delete pannalam.
     * ⚠️ MUKKIYAM: hooks: false kudutha thaan, main model-la irukura
     * beforeDestroy logic (Cloudinary delete) run aagathu.
     */

    await movie.destroy({ transaction: t, hooks: false });

    // 5. Rendu operation-um success-na ippo DB-la save pannu
    await t.commit();

    res.status(200).json({
      success: true,
      message: "Movie moved to trash",
    });
  } catch (error) {
    // 6. Ethavathu oru step fail aana (Network down, Server error), ellathaiyum cancel pannu
    if (t) await t.rollback();

    console.error("Delete Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during deletion",
    });
  }
};

// @desc    Trash-la irukura ellā movies-aiyum edukka
// @route   GET /api/admin/get-trash-movies

exports.getTrashMovies = async (req, res) => {
  try {
    // Trash table-la irukura ellā records-aiyum latest-ah delete pannathu top-la vara mathiri edukkurom
    const trashMovies = await DeletedMovies.findAll({
      order: [["deletedAt", "DESC"]],
    });

    // Oru vela trash empty-ah iruntha
    if (!trashMovies || trashMovies.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Trash is empty",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      count: trashMovies.length,
      data: trashMovies,
    });
  } catch (error) {
    console.error("Get Trash Movies Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching trash movies",
    });
  }
};

// @desc    Restore movie from trash to main table
// @route   POST /api/admin/restore-movie/:trashId

exports.restoreMovie = async (req, res) => {
  const { trashId } = req.params;

  const t = await sequelize.transaction();

  try {
    // 1. Trash table-la irunthu movie-ai kandupidi
    const trashMovie = await DeletedMovies.findByPk(trashId, {
      transaction: t,
    });

    if (!trashMovie) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Movie not found in trash" });
    }

    // 2. Data-vai thirumba JSON objects-ah mathanum (Stringify-ah irukkurathaala)
    const restoreData = trashMovie.toJSON();

    // Intha fields ellam string-ah iruntha, thirumba object-ah mathurom
    const jsonFields = [
      "language",
      "availableOn",
      "genres",
      "mediaLinks",
      "galleryLinks",
      "boxOffice",
      "releaseInfo",
      "streamReleaseInfo",
    ];

    jsonFields.forEach((field) => {
      let value = restoreData[field];

      // 🔥 LOOP LOGIC: Eppo varaikkum value 'string'-ah iruko, appo varaikkum parse pannu
      while (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);

          // Oru vela parse panni vantha result-um string-ah iruntha, thirumba loop run aagum
          // Illaina (Object/Array vantha) ithu thaan final value
          value = parsed;
        } catch (error) {
          // Oru vela parse panna mudiyaatha normal string-ah iruntha (e.g. "Action"), loop-ai break pannu
          break;
        }
      }
      // Final-ah kidaitha (Object or Array) value-ai thirumba assign pannurom
      restoreData[field] = value;
    });

    // 3. Main table-ku poga koodatha extra fields-ai remove pannu
    const originalId = restoreData.originalId;
    // Intha fields main table schema-la irukaathu, so remove them
    delete restoreData.id;
    delete restoreData.originalId;
    delete restoreData.deletedAt;
    delete restoreData.deletedBy;
    delete restoreData.deletionReason;
    delete restoreData.createdAt;
    delete restoreData.updatedAt;

    // 4. Main table-la thirumba insert pannu
    // Note: Model name check pannikonga (e.g., CentralizedJsonBulkMovies)
    await CentralizedJsonBulkCreate.create(
      {
        ...restoreData,
        id: originalId,
      },
      { transaction: t },
    );

    // 5. Success-na trash-la irunthu antha record-ai remove pannu
    await trashMovie.destroy({ transaction: t });

    // Ellamae ok-na DB-la save pannu
    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Movie restored successfully",
      restoredId: originalId,
    });
  } catch (error) {
    if (t) await t.rollback();
    console.error("Restore Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during restoration",
      error: error.message,
    });
  }
};

// @desc    Permanently delete movies from Trash and Cloudinary (Single & Bulk)
// @route   DELETE /api/admin/permanent-delete-movies
exports.permanentDeleteMovies = async (req, res) => {
  // Frontend-la irunthu array-ah anupunga: { ids: [1, 2, 3] }

  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide an array of movie IDs to delete.",
    });
  }

  const t = await sequelize.transaction();

  try {
    // 1. Database-la irunthu antha movies-oda image details edukkalaam
    const moviesToDelete = await DeletedMovies.findAll({
      where: {
        id: ids,
      },
      attributes: ["id", "imagePublicId"],
      transaction: t,
    });

    if (moviesToDelete.length === 0) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "No matching records found in trash.",
      });
    }

    // 2. Cloudinary safety check logic
    // filter(Boolean) - id null, undefined, or empty string-ah iruntha remove pannidum
    const publicIds = moviesToDelete
      .map((movie) => movie.imagePublicId)
      .filter(Boolean);

    if (publicIds.length > 0) {
      // Cloudinary resources-ai bulk-ah delete panna 'delete_resources' method best
      // Ithu loop panni delete panratha vida fast-ah irukkum
      try {
        await cloudinary.api.delete_resources(publicIds);
      } catch (cloudinaryErr) {
        console.error("Cloudinary Deletion Warning:", cloudinaryErr);
        // Cloudinary fail aanaalum DB delete aaga vendum-na inga rollback panna thavaiyillai
        // Image apparam kooda clean pannikalam, but DB integrity thaan mukkiyam
      }
    }

    // 3. Trash Table-la irunthu records-ai permanent-ah delete pannunga
    await DeletedMovies.destroy({
      where: {
        id: ids,
      },
      transaction: t,
    });

    // Ellamae ok-na DB-la permanent-ah save pannidunga
    await t.commit();
    return res.status(200).json({
      success: true,
      message: `movie(s) permanently removed .`,
    });
  } catch (error) {
    if (t) await t.rollback();
    console.error("Permanent Delete Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to permanently delete movies. Transaction rolled back.",
    });
  }
};

exports.getJsonMoviePublicHomeData = async (req, res) => {
  try {
    // 🚀 Parallel Database Queries
    const [
      theatricalUpcoming,
      theatricalNew,
      theatricalTrending,
      streamingUpcoming,
      streamingNew,
      streamingTrending,
    ] = await Promise.all([
      // --- THEATRICAL QUERIES ---
      CentralizedJsonBulkCreate.findAll({
        where: {
          releaseMode: "THEATRICAL",
          streamType: "UPCOMING",
          isTheatreReleased: false,
          movieStatus: "WAITING",
        },
        // Upcoming padangal ku: Date mela pogapoga (Ascending)
        order: [
          // NULL values-ai kadaisiya thallurathukku (MySQL logic)
          [sequelize.literal("theatreReleaseDate IS NULL"), "ASC"],
          [sequelize.col("theatreReleaseDate"), "ASC"],
        ],
      }),
      CentralizedJsonBulkCreate.findAll({
        where: {
          releaseMode: "THEATRICAL",
          streamType: "NEW_RELEASE",
          isTheatreReleased: true,
          movieStatus: "RELEASED",
        },
        order: [
          // Latest date (DESC) mela varum, aana NULL values list-oda bottom-ku poidum
          [sequelize.literal("theatreReleaseDate IS NULL"), "ASC"],
          [sequelize.col("theatreReleaseDate"), "DESC"],
        ],
      }),
      CentralizedJsonBulkCreate.findAll({
        where: { isTrending: true, streamType: "TRENDING" },
        order: [
          ["order", "ASC"],
          ["viewCount", "DESC"],
        ],
      }),

      // --- STREAMING QUERIES ---
      CentralizedJsonBulkCreate.findAll({
        where: {
          releaseMode: "DIRECT_STREAMING",
          streamType: "UPCOMING",
          isStreamingReleased: false,
          movieStatus: "WAITING",
        },
        order: [
          [sequelize.literal("ottReleaseDate IS NULL"), "ASC"],
          [sequelize.col("ottReleaseDate"), "ASC"],
        ],
      }),
      CentralizedJsonBulkCreate.findAll({
        where: {
          releaseMode: "DIRECT_STREAMING",
          streamType: "NEW_RELEASE",
          isStreamingReleased: true,
          movieStatus: "RELEASED",
        },
        order: [
          [sequelize.literal("ottReleaseDate IS NULL"), "ASC"],
          [sequelize.col("ottReleaseDate"), "DESC"],
        ],
      }),
      CentralizedJsonBulkCreate.findAll({
        where: { isTrending: true, streamType: "TRENDING" },
        order: [
          ["order", "ASC"],
          ["viewCount", "DESC"],
        ],
      }),
    ]);

    // ✨ 1. DATE FORMATTING HELPER FUNCTION
    const formatDate = (dateValue) => {
      if (!dateValue || dateValue === "null") return "TBA";
      const m = moment(dateValue);
      return m.isValid ? m.format("MMM DD YYYY") : "TBA";
    };

    // 🚀 2. JSON Parsing Helper with WHILE loop
    // Ithu list-la irukura ovvoru movie-kum string fields-ai parse pannum
    const parseList = (list) => {
      if (!list || list.length === 0) return [];

      let i = 0;
      const parsedResults = [];
      const fields = [
        "language",
        "genres",
        "availableOn",
        "mediaLinks",
        "galleryLinks",
        "boxOffice",
        "releaseInfo",
        "streamReleaseInfo",
      ];

      while (i < list.length) {
        // Sequelize object-ai plain JS object-ah mathurom
        let movie = list[i].get({ plain: true });
        // --- ✨ Inga thaan date format panrom ---
        movie.releaseDate = formatDate(movie.releaseDate);
        movie.theatreReleaseDate = formatDate(movie.theatreReleaseDate);
        movie.ottReleaseDate = formatDate(movie.ottReleaseDate);

        let j = 0;
        while (j < fields.length) {
          let fieldName = fields[j];
          // Check if field is a string and not null
          if (movie[fieldName] && typeof movie[fieldName] === "string") {
            try {
              movie[fieldName] = JSON.parse(movie[fieldName]);
            } catch (e) {
              // Parse panna mudila na skip aagum (corrupt data handling)
              console.warn(`Could not parse ${fieldName} for ID: ${movie.id}`);
            }
          }
          j++;
        }
        parsedResults.push(movie);
        i++;
      }
      return parsedResults;
    };

    // 🛡️ Safe check & Empty Handling: Database-la irunthu null varuvathu rare,
    // aana frontend smooth-ah handle panna oru safe fallback mechanism

    const result = {
      theatrical: {
        upcoming: parseList(theatricalUpcoming),
        newRelease: parseList(theatricalNew),
        trending: parseList(theatricalTrending),
      },
      streaming: {
        upcoming: parseList(streamingUpcoming),
        newRelease: parseList(streamingNew),
        trending: parseList(streamingTrending),
      },
    };

    // Re-calculating counts after parsing
    result.theatrical.count =
      result.theatrical.upcoming.length +
      result.theatrical.newRelease.length +
      result.theatrical.trending.length;
    result.streaming.count =
      result.streaming.upcoming.length +
      result.streaming.newRelease.length +
      result.streaming.trending.length;

    // 📢 Oru vela total data-vae illaiyendraal kooda 'success: true' thaan anuppanum,
    // appo thaan loading screen marainju "No Content" message frontend-la kaatta mudiyum.
    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("🔥 Home Data Controller Error:", error.message);

    // Error handling - Sending proper status code
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching home data",
      error: process.env.NODE_ENV === "development" ? error.message : {}, // Development-la mattum full error details kaattum
    });
  }
};
