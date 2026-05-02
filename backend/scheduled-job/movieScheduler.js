const cron = require("node-cron");
const CentralizedJsonBulkCreate = require("../models/CentralizedMoviesCreateModels/CentralizedJsonBulkCreate");
const { Op } = require("sequelize");

exports.initMovieSchedular = () => {
  // Every minute run aagum
  cron.schedule("* * * * *", async () => {
    // console.log("Schedule Runnung Start");
    try {
      const now = new Date(); // Current UTC time

      const commonWhere = {
        isManualUpdate: false,
        movieStatus: {
          [Op.ne]: "COMPLETED", // IMPORTANT: Completed movies-ai thoda koodathu
        },
      };

      // Rendu update process-ayum parallel-ah start panrom (Fastest way)

      const [theatreResult, ottResult] = await Promise.all([
        // 1. Theatre Release Update
        CentralizedJsonBulkCreate.update(
          {
            streamType: "NEW_RELEASE",
            isTheatreReleased: true,
            releaseMode: "THEATRICAL",
            movieStatus: "RELEASED", // Status update
          },
          {
            where: {
              ...commonWhere,
              theatreReleaseDate: {
                [Op.ne]: null,
                [Op.lte]: now,
              },
              isTheatreReleased: false,
            },
          },
        ),
        // 2. OTT Release Update
        CentralizedJsonBulkCreate.update(
          {
            streamType: "NEW_RELEASE",
            isStreamingReleased: true,
            movieStatus: "RELEASED", // Status update
            releaseMode: "DIRECT_STREAMING", // OTT-la release aagum pothu 'DIRECT_STREAMING' mode-ku mathurom
          },
          {
            where: {
              ...commonWhere,
              ottReleaseDate: {
                [Op.ne]: null,
                [Op.lte]: now,
              },
              isStreamingReleased: false,
            },
          },
        ),
      ]);

      const theatreUpdated = theatreResult[0]; // Update count edukirom
      const ottUpdated = ottResult[0];
      const totalUpdated = theatreUpdated + ottUpdated;

      if (totalUpdated > 0) {
        console.log(
          `[CRON] ${now.toLocaleTimeString()}: ${totalUpdated} movies updated.`,
        );
        if (theatreUpdated > 0)
          console.log(`- Theatre Releases: ${theatreUpdated}`);
        if (ottUpdated > 0) console.log(`- OTT Releases: ${ottUpdated}`);
      }
    } catch (error) {
      console.error("[CRON ERROR]:", error.message);
    }
  });

  // --- 2. MIDNIGHT CRON (Status: RELEASED -> COMPLETED) ---
  // Rathiri correct-ah 12:00 AM-ku mattum run aagum (Server load romba kammi)

  cron.schedule("0 0 * * *", async () => {
    console.log("[MIDNIGHT CRON]: Checking for movies to complete...");
    try {
      const now = new Date();
      await this.checkAndCompleteMovies(now);
    } catch (error) {
      console.error("[MIDNIGHT CRON ERROR]:", error.message);
    }
  });

  // cron.schedule("* * * * *", async () => {
  //   const now = new Date();
  //   console.log(
  //     `[TESTING CRON - ${now.toLocaleTimeString()}]: Checking for 15-min completion...`,
  //   );
  //   try {
  //     await this.checkAndCompleteMoviesDev(now);
  //   } catch (error) {
  //     console.error("[TESTING CRON ERROR]:", error.message);
  //   }
  // });

  console.log(
    "✅ Dual Scheduler Initialized: Minute Sync & Midnight Auto-Complete.",
  );
};

// 20 Days monitoring logic
exports.checkAndCompleteMovies = async (now) => {
  try {
    // 1. RELEASED status-la irukura, manual update illatha movies-a edukurom
    const activeMovies = await CentralizedJsonBulkCreate.findAll({
      where: {
        movieStatus: "RELEASED",
        releaseMode: "THEATRICAL", // OTT movies-ai thoda koodathu
        isManualUpdate: false,
        theatreReleaseDate: {
          [Op.ne]: null,
        },
      },
    });

    for (const movie of activeMovies) {
      // 2. DB-la irunthu vara Date-ai Object-ah matharom (String-ah irunthalum ithu handle pannum)
      const releaseDateRaw = new Date(movie.theatreReleaseDate);

      if (isNaN(releaseDateRaw.getTime())) {
        console.log(`[CRON-ERROR] ${movie.title} has an invalid date format.`);
        continue;
      }

      // 2. Release Date-ai "Start of the Day" (00:00:00) ku maathurom
      const releaseDate = new Date(releaseDateRaw);
      releaseDate.setHours(0, 0, 0, 0);

      // 3. Current Date (Now)-aiyum "Start of the Day" (00:00:00) ku maathurom
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      // 4. Milliseconds diff kandupudichu "Calendar Days" calculate panrom
      const diffInTime = today.getTime() - releaseDate.getTime();
      const daysDiff = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

      // 5. UNGA SCHEMA FIELD: theatreRunDays (Default 20)
      const limit = movie.theatreRunDays || 20;

      // Midnight 12 AM cross aanaale diff update aagidum
      if (daysDiff >= limit) {
        await movie.update({
          movieStatus: "COMPLETED",
          isTheatreReleased: false, // Website-la automatic hide aagidum
        });
        console.log(
          `[CRON] ${movie.title}: ${daysDiff} days over. Status updated to COMPLETED.`,
        );
      }
    }
  } catch (error) {
    console.error("Auto-Complete Logic Error:", error);
  }
};

// --- DEVELOPMENT CONTROLLER (3 Minutes Logic) ---
exports.checkAndCompleteMoviesDev = async (now) => {
  try {
    const activeMovies = await CentralizedJsonBulkCreate.findAll({
      where: {
        movieStatus: "RELEASED",
        isManualUpdate: false,
        theatreReleaseDate: { [Op.ne]: null },
      },
    });

    for (const movie of activeMovies) {
      // IST/UTC conversion issues-ah thavirkka movie.theatreReleaseDate-ai correct-ah parse panrom
      const releaseTimeRaw = new Date(movie.theatreReleaseDate);

      if (isNaN(releaseTimeRaw.getTime())) {
        console.log(`[DEV-ERROR] ${movie.title} has invalid date.`);
        continue;
      }

      const releaseTime = releaseTimeRaw.getTime();
      const currentTime = new Date().getTime();

      const diffInMs = currentTime - releaseTime;
      const minutesDiff = Math.floor(diffInMs / (1000 * 60));

      // --- TESTING LIMIT: 3 MINUTES ---
      const testLimit = 3;

      console.log(`[DEV-CHECK] ${movie.title} | Diff: ${minutesDiff} mins`);

      if (minutesDiff >= testLimit) {
        movie.movieStatus = "COMPLETED";
        movie.isTheatreReleased = false;
        await movie.save();

        console.log(
          `[DEV-COMPLETE] ✅ ${movie.title} status changed to COMPLETED.`,
        );
      } else {
        console.log(
          `[DEV-WAIT] ⏳ ${movie.title} needs ${testLimit - minutesDiff} more minutes.`,
        );
      }
    }
  } catch (error) {
    console.error("Dev Auto-Complete Logic Error:", error);
  }
};
