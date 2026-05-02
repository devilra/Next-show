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

const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(
  "/uploads/casts",
  express.static(path.join(__dirname, "public/uploads/casts")),
);
app.use(
  cors({
    origin: [
      "https://nextshow.in",
      "https://next-show-eight.vercel.app",
      "http://localhost:5173",
      "https://nextshow.vercel.app",
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
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully!");

    // 2. Ippo sync pannum pothu Cast, Movie and MovieCast link aagidhum
    await sequelize.sync({
      alter: true,
    });
    console.log("✅ Tables synced successfully!");
    initMovieSchedular();
  } catch (error) {
    console.error("❌ DB Errors:", error);
  }
})();

app.use("/api/auth", adminAuthRoutes);
app.use("/api/home", VideoSectionRoutes);
app.use("/api/home", BlogSectionRoutes);
app.use("/api/home", HomeStreamRoutes);
app.use("/api/stream", StreamingVideoRoutes);
app.use("/api/home", HomeMoviesRoutes);
app.use("/api/home", HomeTrailersRoutes);
app.use("/api/centralized", CentralizedMovieRoutes);
app.use("/api/trailers", NewTrailersRoutes);

//Centralized Json BulK Movie Create Route

app.use("/api/admin", CentralizedJsonMovieRoute);
app.use("/api/admin", CastRoutes);
app.use("/api/admin", TmdbRoutes);

//Website Tracking Routes
app.use("/api/admin", WebsiteVisitCountTracking);

// Simple root route for testing
app.get("/", (req, res) => {
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

const server = app.listen(PORT, () => {
  console.log(`Server Connected ${PORT}`);
});

server.timeout = 700000;
