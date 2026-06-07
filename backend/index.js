const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/db");
require("dotenv").config();
const path = require("path");
// require("./models/associationIndex");
// require("./models/CentralizedMoviesCreateModels/CentralizedJsonBulkCreate");
// require("./models/DeletedRestoreMovies/DeletedMovies");
// require("./models/Cast/Cast");
// require("./models/CentralizedMoviesCreateModels/MovieCast");
// require("./models/WebsiteTracking/AnalyticsEvents");
// require('./models/CentralizedNewsModels/TagsModel')
// require('./models/CentralizedNewsModels/CentralizedNewsModel')
// require('./models/UserAuth/UserAuth')
// require('./models/UserAuth/MarkWatched')
// require('./models/UserAuth/UserMovieRating')
// require('./models/UserAuth/UserRecentView')
// require('./models/UserAuth/UserWatchLater')
// require('./models/UserAuth/UserWatchlistModel')

// require("./models/WebsiteTracking/DailyStats");
// require("./models/CentralizedMoviesCreateModels/MovieDetailsAnalyticsModel");
// require("./models/UserAuth/UserNewsLikeModel");
// require("./models/UserAuth/UserReviewLikeModel");
// require("./models/UserAuth/UserReviewReplyModel");
// require("./models/UserAuth/UserReviewReplyLikeModel");
const adminAuthRoutes = require("./routes/AdminAuthRoutes/AdminRoutes");
const VideoSectionRoutes = require("./routes/HomePageRoutes/videoRoutes");
const BlogSectionRoutes = require("./routes/HomePageRoutes/blogRoutes");
const StreamingVideoRoutes = require("./routes/StreamingNow/StreamVideoRoutes");
const HomeStreamRoutes = require("./routes/HomePageRoutes/HomeStreamRoute");
const HomeMoviesRoutes = require("./routes/HomePageRoutes/HomeMovieRoute");
const HomeTrailersRoutes = require("./routes/HomePageRoutes/HomeTrailersRoute");
const CentralizedMovieRoutes = require("./routes/CentralizedMovieRoute/CentralizedmovieRoute");
const NewTrailersRoutes = require("./routes/HomePageRoutes/NewTrailersRoute");
const { initMovieSchedular } = require("./scheduled-job/movieScheduler");
const CentralizedJsonMovieRoute = require("./routes/CentralizedMovieRoute/CentralizedJsonMovieRoute");
const CastRoutes = require("./routes/CastRoutes/CastRoutes");
const TmdbRoutes = require("./routes/TMDB-Routes/tmdbRoutes");
const WebsiteVisitCountTracking = require("./routes/WebsiteTrackingRoutes/WebsiteVisitCount");
const TagsRoutes = require("./routes/TagsRoutes/TagsRoutes");
const NewsRoutes = require("./routes/NewsRoutes/NewsRoutes");
const UserAuthRoutes = require("./routes/UserAuthRoutes/UserAuthRoutes");
const UserRateLikeMarkRoutes = require("./routes/UserRateLikeMarkRoutes/UserRateLikeMarkRoutes");

const app = express();
const BASE_URL = process.env.BASE_URL || ""; // Production-la "/nextshow_backend_v2" nu varum

app.use(express.json({ limit: "100mb" }));
app.use(express.static(path.join(__dirname, "public")));

// console.log(path.join(__dirname, "public"));

//important notes
//CPanel File Manager-la poyi public/uploads folder-ku permission
//  755 illa 775 irukkuradha confirm pannikonga.
//  Appo dhaan Multer-ala folder create panni file-ah ulla poda mudiyum.

app.use(
  cors({
    origin: [
      "https://nextshow.in",
      "https://next-show-eight.vercel.app",
      "http://localhost:5173",
      "https://nextshow.vercel.app",
      "http://192.168.1.51:5173",
      "http://10.181.5.237:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(cookieParser()); // Cookie parser-க்கு
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

//Immediate call function

(async () => {
  try {
    require("./models/associationIndex");
    await sequelize.authenticate();
    // console.log("✅ MySQL connected successfully!");

    // 2. Ippo sync pannum pothu Cast, Movie and MovieCast link aagidhum
    await sequelize.sync({
      alter: false,
      force: false,
    });
    // console.log("✅ Tables synced successfully!");
  } catch (error) {
    console.error("❌ DB Errors:", error);
  }
})();

app.use(`${BASE_URL}/api/auth`, adminAuthRoutes);
app.use(`${BASE_URL}/api/home`, VideoSectionRoutes);
app.use(`${BASE_URL}/api/home`, BlogSectionRoutes);
app.use(`${BASE_URL}/api/home`, HomeStreamRoutes);
app.use(`${BASE_URL}/api/stream`, StreamingVideoRoutes);
app.use(`${BASE_URL}/api/home`, HomeMoviesRoutes);
app.use(`${BASE_URL}/api/home`, HomeTrailersRoutes);
app.use(`${BASE_URL}/api/centralized`, CentralizedMovieRoutes);
app.use(`${BASE_URL}/api/trailers`, NewTrailersRoutes);

//Centralized Json BulK Movie Create Route

app.use(`${BASE_URL}/api/admin`, CentralizedJsonMovieRoute);
app.use(`${BASE_URL}/api/admin`, CastRoutes);
app.use(`${BASE_URL}/api/admin`, TmdbRoutes);

//Website Tracking Routes
app.use(`${BASE_URL}/api/admin`, WebsiteVisitCountTracking);
app.use(`${BASE_URL}/api/admin`, TagsRoutes);
app.use(`${BASE_URL}/api/admin`, NewsRoutes);

//UserAuthRoutes
app.use(`${BASE_URL}/api/auth/user`, UserAuthRoutes);
app.use(`${BASE_URL}/api/auth/user`, UserRateLikeMarkRoutes);

// Simple root route for testing
app.get(`${BASE_URL}/`, (req, res) => {
  res.send("NextShow Express Backend is running.");
});

// ===================================
// 🚨 ERROR HANDLING MIDDLEWARES (இதைச் சேர்ப்பதன் மூலம் [object Object] பிழை நீங்கும்)
// ===================================

// 1. 404 Route Not Found Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// 2. 💡 General Error Handler (இதில் Multer பிழைகளும் கையாளப்படும்)
app.use((err, req, res, next) => {
  // Status Code: 500 (Internal Server Error) அல்லது ஏற்கனவே அமைக்கப்பட்ட Status Code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Response-ஐ JSON Format-இல் அனுப்பவும் (இது [object Object] வருவதைத் தடுக்கும்)
  res.json({
    message: err.message,
    // Development mode-இல் Stack Trace-ஐக் காட்டலாம்
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5176;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Connected ${PORT}`);
  initMovieSchedular();
});

server.timeout = 700000;
