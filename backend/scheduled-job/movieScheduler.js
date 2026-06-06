const cron = require("node-cron");
const CentralizedJsonBulkCreate = require("../models/CentralizedMoviesCreateModels/CentralizedJsonBulkCreate");
const { Op } = require("sequelize");
const fs = require("fs");

exports.initMovieSchedular = () => {
  // Every minute run aagum
  cron.schedule("* * * * *", async () => {
    // console.log("Schedule Runnung Start");
    // fs.appendFileSync(
    //   "./cron.log",
    //   `CRON RUNNING => ${new Date().toISOString()}\n`,
    // );

    // console.log("CRON RUNNING", new Date());
    try {
      const now = new Date(); // Current UTC time

      const commonWhere = {
        isManualUpdate: false,
        // isTrending: false,
        movieStatus: {
          [Op.ne]: "COMPLETED", // IMPORTANT: Completed movies-ai thoda koodathu
        },
      };

      // Rendu update process-ayum parallel-ah start panrom (Fastest way)

      const [theatreRollback, ottRollback, theatreResult, ottResult] =
        await Promise.all([
          // THEATRE ROLLBACK
          CentralizedJsonBulkCreate.update(
            {
              streamType: "UPCOMING",
              isTheatreReleased: false,
              movieStatus: "WAITING",
            },
            {
              where: {
                releaseMode: "THEATRICAL",
                isManualUpdate: false,
                theatreReleaseDate: {
                  [Op.gt]: now,
                },
                isTheatreReleased: true,
              },
            },
          ),
          // OTT ROLLBACK
          CentralizedJsonBulkCreate.update(
            {
              streamType: "UPCOMING",
              isStreamingReleased: false,
              movieStatus: "WAITING",
            },
            {
              where: {
                releaseMode: "DIRECT_STREAMING",
                isManualUpdate: false,
                ottReleaseDate: {
                  [Op.gt]: now,
                },
                isStreamingReleased: true,
              },
            },
          ),
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
                releaseMode: "THEATRICAL",
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
                releaseMode: "DIRECT_STREAMING",
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
      await Promise.all([
        await this.decreaseRemainingDays(),
        await this.checkAndCompleteMovies(now),
        await this.checkTrendingMovies(now),
      ]);
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
  //     await Promise.all([
  //       this.checkAndCompleteMoviesDev(now),
  //       this.checkTrendingMoviesDev(now),
  //     ]);
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
        isTrending: false,
        releaseMode: "THEATRICAL", // OTT movies-ai thoda koodathu
        isManualUpdate: false,
        isTheatreReleased: true,
        theatreReleaseDate: {
          [Op.ne]: null,
        },
      },
    });

    // for (const movie of activeMovies) {
    //   // 2. DB-la irunthu vara Date-ai Object-ah matharom (String-ah irunthalum ithu handle pannum)
    //   const releaseDateRaw = new Date(movie.theatreReleaseDate);

    //   if (isNaN(releaseDateRaw.getTime())) {
    //     console.log(`[CRON-ERROR] ${movie.title} has an invalid date format.`);
    //     continue;
    //   }

    //   // 2. Release Date-ai "Start of the Day" (00:00:00) ku maathurom
    //   const releaseDate = new Date(releaseDateRaw);
    //   releaseDate.setHours(0, 0, 0, 0);

    //   // 3. Current Date (Now)-aiyum "Start of the Day" (00:00:00) ku maathurom
    //   const today = new Date(now);
    //   today.setHours(0, 0, 0, 0);

    //   // 4. Milliseconds diff kandupudichu "Calendar Days" calculate panrom
    //   const diffInTime = today.getTime() - releaseDate.getTime();
    //   const daysDiff = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

    //   // 5. UNGA SCHEMA FIELD: theatreRunDays (Default 20)
    //   const limit = movie.theatreRunDays || 20;

    //   // Midnight 12 AM cross aanaale diff update aagidum
    //   if (daysDiff >= limit) {
    //     await movie.update({
    //       movieStatus: "COMPLETED",
    //       isTheatreReleased: false, // Website-la automatic hide aagidum
    //     });
    //     console.log(
    //       `[CRON] ${movie.title}: ${daysDiff} days over. Status updated to COMPLETED.`,
    //     );
    //   }
    // }

    for (const movie of activeMovies) {
      if (movie.remainingTheatreDays <= 0) {
        await movie.update({
          movieStatus: "COMPLETED",
          isTheatreReleased: false,
          theatreStatus: "ENDED",
        });
        console.log(`[COMPLETE CRON] ${movie.title} moved to COMPLETED`);
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

exports.checkTrendingMoviesDev = async (now) => {
  try {
    const trendingMovies = await CentralizedJsonBulkCreate.findAll({
      where: {
        isTrending: true,

        isManualUpdate: false,

        trendingStartDate: {
          [Op.ne]: null,
        },

        movieStatus: {
          [Op.ne]: "COMPLETED",
        },

        // releaseMode: {
        //   [Op.in]: ["THEATRICAL", "DIRECT_STREAMING"],
        // },
      },
    });

    for (const movie of trendingMovies) {
      const trendingDateRaw = new Date(movie.trendingStartDate);

      if (isNaN(trendingDateRaw.getTime())) {
        console.log(
          `[TRENDING DEV ERROR] ${movie.title} invalid trending date.`,
        );
        continue;
      }

      const trendingTime = trendingDateRaw.getTime();

      const currentTime = new Date().getTime();

      const diffInMs = currentTime - trendingTime;

      const minutesDiff = Math.floor(diffInMs / (1000 * 60));

      // 🔥 TEST LIMIT
      const testLimit = 2;

      console.log(
        `[TRENDING DEV CHECK] ${movie.title} | Diff: ${minutesDiff} mins`,
      );

      if (minutesDiff >= testLimit) {
        // THEATRICAL
        if (movie.releaseMode === "THEATRICAL") {
          movie.isTrending = false;

          movie.movieStatus = "COMPLETED";

          movie.isTheatreReleased = false;

          await movie.save();

          console.log(
            `[TRENDING DEV COMPLETE] 🎬 ${movie.title} theatre trending completed.`,
          );
        }

        // DIRECT STREAMING
        else if (movie.releaseMode === "DIRECT_STREAMING") {
          movie.isTrending = false;

          movie.movieStatus = "RELEASED";

          movie.isStreamingReleased = true;

          await movie.save();

          console.log(
            `[TRENDING DEV COMPLETE] 📺 ${movie.title} OTT trending completed.`,
          );
        }
      } else {
        console.log(
          `[TRENDING DEV WAIT] ⏳ ${movie.title} needs ${
            testLimit - minutesDiff
          } more mins.`,
        );
      }
    }
  } catch (error) {
    console.error("[TRENDING DEV ERROR]:", error);
  }
};

// exports.checkTrendingMoviesDev = async (now) => {
//   try {
//     const trendingMovies = await CentralizedJsonBulkCreate.findAll({
//       where: {
//         isTrending: true,
//         isManualUpdate: false,
//         trendingStartDate: { [Op.ne]: null },
//         movieStatus: { [Op.ne]: "COMPLETED" },
//       },
//     });

//     const today = new Date(now);
//     today.setHours(0, 0, 0, 0);

//     for (const movie of trendingMovies) {
//       // Release Date irukanu check panrom
//       const hasReleaseDate = movie.theatreReleaseDate || movie.ottReleaseDate;

//       // --- NEW LOGIC: Release date illana trending days-ah ignore pannu ---
//       if (!hasReleaseDate) {
//         console.log(
//           `[TRENDING-SKIP] ${movie.title}: Release date not announced yet. Staying in Trending.`,
//         );
//         continue; // Next movie-ku poidum, expiry check pannadhu
//       }

//       const trendingDateRaw = new Date(movie.trendingStartDate);
//       if (isNaN(trendingDateRaw.getTime())) continue;

//       const trendingDate = new Date(trendingDateRaw);
//       trendingDate.setHours(0, 0, 0, 0);

//       const diffInTime = today.getTime() - trendingDate.getTime();
//       const daysDiff = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

//       const limit = movie.trendingDays || 25;

//       // Trending expiry reached & Date is also present
//       if (daysDiff >= limit) {
//         if (movie.releaseMode === "THEATRICAL") {
//           await movie.update({
//             isTrending: false,
//             movieStatus: "COMPLETED",
//             isTheatreReleased: false,
//             streamType: "NEW_RELEASE", // Trending mudinjadhala ippo normal release aagiduchi
//           });
//           console.log(
//             `[TRENDING-THEATRE] ${movie.title}: Completed after ${daysDiff} days.`,
//           );
//         } else if (movie.releaseMode === "DIRECT_STREAMING") {
//           await movie.update({
//             isTrending: false,
//             movieStatus: "RELEASED",
//             isStreamingReleased: true,
//             streamType: "NEW_RELEASE",
//           });
//           console.log(
//             `[TRENDING-OTT] ${movie.title}: Shifted to Released after ${daysDiff} days.`,
//           );
//         }
//       }
//     }
//   } catch (error) {
//     console.error("[TRENDING CRON ERROR]:", error);
//   }
// };

//Trending Scheduler Function

// exports.checkTrendingMovies = async (now) => {
//   try {
//     const trendingMovies = await CentralizedJsonBulkCreate.findAll({
//       where: {
//         isTrending: true,
//         isManualUpdate: false,
//         trendingStartDate: { [Op.ne]: null },
//         movieStatus: { [Op.ne]: "COMPLETED" },
//       },
//     });

//     const today = new Date(now);
//     today.setHours(0, 0, 0, 0);

//     for (const movie of trendingMovies) {
//       // Release Date irukanu check panrom
//       const releaseDate =
//         movie.releaseMode === "THEATRICAL"
//           ? movie.theatreReleaseDate
//           : movie.ottReleaseDate;

//       // --- NEW LOGIC: Release date illana trending days-ah ignore pannu ---
//       if (!releaseDate) {
//         console.log(
//           `[TRENDING-SKIP] ${movie.title}: Release date not announced yet. Staying in Trending.`,
//         );
//         continue; // Next movie-ku poidum, expiry check pannadhu
//       }

//       const trendingDateRaw = new Date(movie.trendingStartDate);
//       if (isNaN(trendingDateRaw.getTime())) continue;

//       const trendingDate = new Date(trendingDateRaw);
//       trendingDate.setHours(0, 0, 0, 0);

//       const diffInTime = today.getTime() - trendingDate.getTime();
//       const daysDiff = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

//       const limit = movie.trendingDays || 25;

//       // Trending expiry reached & Date is also present
//       if (daysDiff >= limit) {
//         if (movie.releaseMode === "THEATRICAL") {
//           await movie.update({
//             isTrending: false,
//             movieStatus: "COMPLETED",
//             isTheatreReleased: false,
//             streamType: "NEW_RELEASE", // Trending mudinjadhala ippo normal release aagiduchi
//           });
//           console.log(
//             `[TRENDING-THEATRE] ${movie.title}: Completed after ${daysDiff} days.`,
//           );
//         } else if (movie.releaseMode === "DIRECT_STREAMING") {
//           await movie.update({
//             isTrending: false,
//             movieStatus: "RELEASED",
//             isStreamingReleased: true,
//             streamType: "NEW_RELEASE",
//           });
//           console.log(
//             `[TRENDING-OTT] ${movie.title}: Shifted to Released after ${daysDiff} days.`,
//           );
//         }
//       }
//     }
//   } catch (error) {
//     console.error("[TRENDING CRON ERROR]:", error);
//   }
// };

exports.checkTrendingMovies = async (now) => {
  try {
    const trendingMovies = await CentralizedJsonBulkCreate.findAll({
      where: {
        isTrending: true,
        isManualUpdate: false,
        trendingStartDate: {
          [Op.ne]: null,
        },
        movieStatus: {
          [Op.ne]: "COMPLETED",
        },
        // releaseMode: {
        //   [Op.in]: ["THEATRICAL", "DIRECT_STREAMING"],
        // },
      },
    });

    for (const movie of trendingMovies) {
      const trendingDateRaw = new Date(movie.trendingStartDate);
      if (isNaN(trendingDateRaw.getTime())) {
        console.log(
          `[TRENDING-ERROR] ${movie.title} has invalid trending date.`,
        );
        continue;
      }

      // Start of day normalize

      const trendingDate = new Date(trendingDateRaw);

      trendingDate.setHours(0, 0, 0, 0);
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      // Day diff
      const diffInTime = today.getTime() - trendingDate.getTime();

      const daysDiff = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

      const limit = movie.trendingDays || 25;
      // Trending expiry reached

      if (daysDiff >= limit) {
        if (movie.releaseMode === "THEATRICAL") {
          await movie.update({
            isTrending: false,
            movieStatus: "COMPLETED",
            isTheatreReleased: false,
            streamType: "TRENDING",
          });
          console.log(
            `[TRENDING-THEATRE] ${movie.title}: Trending expired after ${daysDiff} days.`,
          );
        }
        // DIRECT STREAMING
        else if (movie.releaseMode === "DIRECT_STREAMING") {
          await movie.update({
            isTrending: false,
            movieStatus: "RELEASED",
            // OTT still available
            isStreamingReleased: true,
            streamType: "TRENDING",
          });

          console.log(
            `[TRENDING-OTT] ${movie.title}: OTT Trending expired after ${daysDiff} days.`,
          );
        }
      }
    }
  } catch (error) {
    console.error("[TRENDING CRON ERROR]:", error);
  }
};

exports.decreaseRemainingDays = async () => {
  try {
    const runningMovies = await CentralizedJsonBulkCreate.findAll({
      where: {
        releaseMode: "THEATRICAL",
        movieStatus: "RELEASED",
        isTheatreReleased: true,
        remainingTheatreDays: {
          [Op.gt]: 0,
        },
      },
    });

    for (const movie of runningMovies) {
      const newDays = movie.remainingTheatreDays - 1;
      await movie.update({
        remainingTheatreDays: newDays,
      });
      console.log(
        `[DAYS CRON] ${movie.title}
         Remaining Days: ${newDays}`,
      );
    }
  } catch (error) {
    console.error("[REMAINING DAYS ERROR]", error);
  }
};
