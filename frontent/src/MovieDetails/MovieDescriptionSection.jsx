import React, { useEffect, useState } from "react";
import {
  Plus,
  Eye,
  Edit2,
  Users,
  Music,
  Star,
  X,
  Send,
  CheckCircle2,
  Stars,
} from "lucide-react";
import { CiShare2 } from "react-icons/ci";
import { OTT_PLATFORMS } from "../ADMIN/Dashboard/CentralizedContent/CentralizedCreateMovie/OttplatFormData";
import { LuClapperboard } from "react-icons/lu";
import { FaPlay, FaStar } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import { LuCopy } from "react-icons/lu";
import { IoNotificationsOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import IsUserValid from "../ProtectedRoute/IsUserValid";
import { IoAnalytics } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa6";

const MovieDescriptionSection = ({
  movie,
  isRatingModalOpen,
  setIsRatingModalOpen,
  watchedData,
  watchedLoading,
  watchedError,
  toggleMarkWatchedMutation,
  // ============================================
  // ✅ USER RATING
  // ============================================
  userRatingData,
  userRatingLoading,
  userRatingError,
  addMovieRatingMutation,
  // ============================================
  // ✅ WatchList
  // ============================================
  isInWatchlist,
  watchlistLoading,
  watchlistError,
  toggleWatchlistMutation,
  refetchWatchlist,
  analyticsData,
  analyticsLoading,
  analyticsFetching,
}) => {
  // console.log(movie);

  // const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  console.log("Selected Rating", selectedRating);

  const [reviewText, setReviewText] = useState("");

  // console.log("Hover", hover);
  // console.log("Rating", rating);

  // 🔥 1. YouTube ID Extract logic
  const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeID(movie.trailerUrl);
  // High quality thumbnail URL
  const youtubeThumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : movie.posterPath; // Fallback to poster if trailer not found

  // --- Background Scroll Lock Implementation ---
  useEffect(() => {
    if (isRatingModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Component unmount aagum pothu clean up panna
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isRatingModalOpen]);

  const parseData = (data) => {
    try {
      let result = data;
      // Data string-aaga irukkum varai parse pannu (Handling "\"[[...]]\"")
      while (typeof result === "string") {
        result = JSON.parse(result);
      }

      return Array.isArray(result) ? result : [];
    } catch {
      // Oru velai plain string-aa irundha (Ex: "Tamil"), adhayae array-vaa maathuvom
      if (typeof data === "string" && data.trim() !== "") {
        return [data];
      }
      return [];
    }
  };

  const getRatingFeedback = (val) => {
    if (val >= 9) return { emoji: "🔥", text: "Masterpiece! Must watch!" };
    if (val >= 7) return { emoji: "😎", text: "Excellent choice!" };
    if (val >= 5) return { emoji: "👍", text: "Good, worth a watch." };
    if (val >= 3) return { emoji: "😐", text: "It's just okay." };
    if (val > 0) return { emoji: "🥱", text: "Not my cup of tea." };
    return { emoji: "⭐", text: "How would you describe your experience?" };
  };

  const feedback = getRatingFeedback(hover || rating);
  const isActive = rating > 0 || hover > 0;

  const languages = parseData(movie?.language);
  const availableLanguages =
    languages.length > 0
      ? languages
      : ["Tamil", "Telugu", "Hindi", "Malayalam"];

  const STREAMING_PLATFORMS = [
    {
      id: "aha",
      name: "Aha",
      logo: "/Streaming_logo/Aha.webp",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "erosnow",
      name: "erosnow",
      logo: "/Streaming_logo/erosnow.webp",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "hungama",
      name: "Hungama",
      logo: "/Streaming_logo/Hungama.webp",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "jiohotstar",
      name: "jiohotstar",
      logo: "/Streaming_logo/jiohotstar.jpg",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "jojotv",
      name: "JojoTV",
      logo: "/Streaming_logo/JojoTV.webp",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "lionsgateplay",
      name: "LionsgatePlay",
      logo: "/Streaming_logo/LionsgatePlay.webp",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "mx",
      name: "mx",
      logo: "/Streaming_logo/mx.jpg",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "netflix",
      name: "netflix",
      logo: "/Streaming_logo/netflix.jpg",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "playflix",
      name: "playflix",
      logo: "/Streaming_logo/playflix.webp",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "prime",
      name: "prime",
      logo: "/Streaming_logo/prime.jpg",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "sony",
      name: "sony",
      logo: "/Streaming_logo/sony.webp",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "sunnxt",
      name: "sunNxt",
      logo: "/Streaming_logo/sunNxt.jpg",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "timesplay",
      name: "Timesplay",
      logo: "/Streaming_logo/Timesplay.webp",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "ultra",
      name: "Ultra",
      logo: "/Streaming_logo/Ultra.webp",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "z5",
      name: "Z5",
      logo: "/Streaming_logo/Z5.webp",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
  ];

  // ======================================================
  // ✅ SUBMIT MOVIE RATING
  // ======================================================

  const handleSubmitMovieRating = () => {
    // ============================================
    // ✅ PREVENT DOUBLE CLICK
    // ============================================
    if (addMovieRatingMutation?.isPending) {
      return;
    }
    // ============================================
    // ✅ VALIDATION
    // ============================================
    if (!selectedRating) {
      return;
    }
    // ============================================
    // ✅ SUBMIT
    // ============================================
    addMovieRatingMutation.mutate(
      {
        movieId: movie?.id,
        rating: selectedRating,
        review: reviewText,
      },
      {
        onSuccess: () => {
          // ====================================
          // ✅ CLOSE MODAL
          // ====================================
          setIsRatingModalOpen(false);
          // ====================================
          // ✅ RESET
          // ====================================
          setSelectedRating(0);

          setReviewText("");
        },
      },
    );
  };

  const isWatched = watchedData?.watched;
  const alreadyRated = userRatingData?.rated;
  const formatViews = (num = 0) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1).replace(".0", "")}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1).replace(".0", "")}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(".0", "")}K`;
    }
    return num.toString();
  };

  const formatAvgTime = (seconds = 0) => {
    if (!seconds) return "0s";

    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h`;
    }

    if (minutes > 0) {
      return `${minutes}m`;
    }

    return `${secs}s`;
  };
  const totalViews = analyticsData?.totalViews || 0;
  const averageTimeSpent = analyticsData?.averageTimeSpent || 0;

  return (
    <div className="pt-6 bg-[#121212] space-y-4 mb-8 text-white">
      {/* --- New Release Dates Section --- */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
        {/* Background subtle glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 blur-[100px] rounded-full" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-4 md:gap-10">
          {/* Left Side: Action Buttons */}
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            {/* 🔥 ACTION ROW */}
            <div className="flex gap-2 w-full">
              {/* PRIMARY ACTION */}
              {movie.streamType === "UPCOMING" ? (
                <button className="group relative  flex flex-1 md:flex-none items-center justify-center cursor-pointer gap-2 px-4 py-2 md:px-10 rounded-lg md:rounded-xl text-white text-[10px] md:text-[13px] bg-blue-600 transition-all duration-300 hover:shadow-[0_0_10px_10px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-95">
                  <span className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <IoNotificationsOutline className="relative z-10 text-[17px] md:text-[15px] group-hover:animate-bounce" />
                  <span className="relative z-10 text-[13px] md:text-[15px]">
                    REMIND ME
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => window.open(movie.watchUrl, "_blank")}
                  disabled={movie.releaseMode === "THEATRICAL"}
                  className={`group relative flex flex-1 md:flex-none items-center cursor-pointer justify-center gap-1 px-4 py-2 md:px-10 rounded-lg md:rounded-xl text-white  bg-orange-500 transition-all duration-300 hover:shadow-[0_0_10px_5px_rgba(249,115,22,0.4)] hover:scale-[1.02] active:scale-95 ${movie.releaseMode === "THEATRICAL" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <FaPlay className="relative z-10 text-[17px] md:text-[15px]" />
                  <span className="relative z-10 text-[13px] md:text-[15px] ">
                    WATCH NOW
                  </span>
                </button>
              )}

              {/* ====================================================== */}
              {/* ✅ WATCHLIST BUTTON */}
              {/* ====================================================== */}

              <IsUserValid>
                {watchlistLoading ? (
                  <div
                    className="
  flex-1
    h-[52px]
     rounded-lg md:rounded-xl
      border border-white/10
      bg-gradient-to-br
      from-zinc-800
      via-zinc-900
      to-black/40

      overflow-hidden
px-20
      relative
    "
                  >
                    {/* ================================================ */}
                    {/* ✅ SHIMMER */}
                    {/* ================================================ */}

                    <div
                      className="
        absolute inset-0

        animate-pulse

        bg-gradient-to-r
        from-transparent
        via-white/[0.04]
        to-transparent
      "
                    />

                    {/* ================================================ */}
                    {/* ✅ CONTENT */}
                    {/* ================================================ */}

                    <div
                      className="
        relative z-10

        h-full

        flex items-center justify-center gap-3
      "
                    >
                      {/* HEART */}

                      {/* TEXT */}

                      <div className="flex items-center gap-2">
                        <div className="relative flex items-center justify-center">
                          {/* ============================================ */}
                          {/* ✅ OUTER GLOW */}
                          {/* ============================================ */}

                          <div
                            className="
        absolute

        w-5 h-5

        rounded-full

        bg-red-500/20

        blur-[6px]

        animate-pulse
      "
                          />

                          {/* ============================================ */}
                          {/* ✅ JELLY SPINNER */}
                          {/* ============================================ */}

                          <div
                            className="
        w-5 h-5

        rounded-full

        border-[2px]
        border-white/10
        border-t-red-500
        border-r-red-400

        animate-spin

        motion-safe:animate-[spin_0.7s_linear_infinite]

        shadow-[0_0_12px_rgba(239,68,68,0.45)]
      "
                            style={{
                              animation:
                                "spin 0.7s linear infinite, jelly 1.2s ease-in-out infinite",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    layout
                    disabled={toggleWatchlistMutation?.isPending}
                    onClick={() => {
                      // ================================================
                      // ✅ PREVENT DOUBLE CLICK
                      // ================================================

                      if (toggleWatchlistMutation?.isPending) {
                        return;
                      }

                      // ================================================
                      // ✅ TOGGLE WATCHLIST
                      // ================================================

                      toggleWatchlistMutation.mutate();
                    }}
                    className={`
      group

      cursor-pointer

      relative
      flex-none
      md:flex-1

      flex items-center justify-center gap-2

      px-4 py-2.5
      md:py-4 md:px-10

      rounded-lg md:rounded-xl

      text-white
      text-[10px] md:text-[13px]

      border

      shadow-2xl

      transition-all duration-500

      hover:-translate-y-0.5

      active:scale-95

      overflow-hidden

      ${
        isInWatchlist
          ? `
            bg-gradient-to-br
            from-red-500/15
            via-zinc-900
            to-black/40

            border-red-500/20

            shadow-[0_0_25px_rgba(239,68,68,0.12)]
          `
          : `
            bg-gradient-to-br
            from-zinc-800
            via-zinc-900
            to-black/40

            border-white/10

            hover:border-white/30

            hover:shadow-[0_0_30px_5px_rgba(255,255,255,0.15)]
          `
      }

      ${
        toggleWatchlistMutation?.isPending
          ? "opacity-70 cursor-not-allowed"
          : ""
      }
    `}
                  >
                    {/* ================================================ */}
                    {/* ✅ HOVER LAYER */}
                    {/* ================================================ */}

                    <span
                      className="
        absolute inset-0

        rounded-lg md:rounded-xl

        bg-white/5

        opacity-0

        group-hover:opacity-100

        transition-opacity duration-300
      "
                    />

                    {/* ================================================ */}
                    {/* ✅ ICON */}
                    {/* ================================================ */}

                    <motion.div
                      key={isInWatchlist ? "added" : "default"}
                      initial={{
                        scale: 0.8,
                        opacity: 0,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                    >
                      <IoMdHeartEmpty
                        className={`
          relative z-10

          text-[20px] md:text-[23px]

          transition-all duration-300

          ${
            isInWatchlist
              ? `
                text-red-500

                drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]
              `
              : `
                text-zinc-400

                group-hover:text-red-500
              `
          }
        `}
                      />
                    </motion.div>

                    {/* ================================================ */}
                    {/* ✅ TEXT */}
                    {/* ================================================ */}

                    <AnimatePresence mode="wait">
                      <motion.span
                        key={
                          toggleWatchlistMutation?.isPending
                            ? "updating"
                            : isInWatchlist
                              ? "remove"
                              : "watchlist"
                        }
                        initial={{
                          y: 10,
                          opacity: 0,
                        }}
                        animate={{
                          y: 0,
                          opacity: 1,
                        }}
                        exit={{
                          y: -10,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                        className={`
          relative z-10

          tracking-widest
          text-[12px]
          transition-colors duration-300
          hidden md:inline-block
          ${isInWatchlist ? "text-red-400" : "text-white"}
        `}
                      >
                        {toggleWatchlistMutation?.isPending
                          ? "UPDATING..."
                          : isInWatchlist
                            ? "WATCHLISTED"
                            : "WATCHLIST"}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                )}
              </IsUserValid>

              {/* SHARE */}
              <button
                onClick={() =>
                  navigator.share({
                    title: movie.title,
                    url: window.location.href,
                  })
                }
                className="group relative flex items-center justify-center px-4 md:px-5 py-2.5 rounded-lg md:rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black/40 border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-[0_0_25px_5px_rgba(255,255,255,0.12)] hover:border-white/30 hover:-translate-y-0.5 active:scale-90"
              >
                <span className="absolute inset-0 rounded-lg md:rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CiShare2
                  size={22}
                  className="relative z-10 text-zinc-400 group-hover:text-white transition-all duration-300 group-hover:scale-110"
                />
              </button>
            </div>
          </div>

          {/* ✅ Language Container Section - Layout Optimized */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start lg:items-center gap-4 mt-[-4px] md:mt-0">
            {/* Optional: Vertical Divider for Desktop */}
            <div className="hidden lg:block w-[1px] h-12 bg-white/10 mx-2" />

            {/* Language Container */}
            <div className="group relative flex flex-wrap items-center justify-start gap-2 p-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black/40 border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-[0_0_25px_5px_rgba(255,255,255,0.12)] hover:border-white/20">
              <span className="absolute inset-0 rounded-xl md:rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Globe Icon */}
              <div className="relative z-10 flex items-center gap-2 pr-2 border-r border-white/10">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-zinc-400 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>

              {/* Languages Loop */}
              <div className="relative z-10 flex flex-wrap items-center gap-2 md:gap-3">
                {availableLanguages.map((lang, idx) => (
                  <div key={idx} className="flex items-center gap-2 md:gap-3">
                    {/* text-[9px] used for better mobile fit */}
                    <span className="text-[10px] md:text-[11px] tracking-[0.13em] font-medium uppercase text-zinc-300 group-hover:text-white transition-colors">
                      {lang}
                    </span>
                    {idx !== availableLanguages.length - 1 && (
                      <div className="w-1 h-1 rounded-full bg-zinc-600 group-hover:bg-zinc-400 transition-colors" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container: Mobile-la flex-col, Desktop-la flex-row (gap-12) */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 mt-10">
        {/* Left Side: Description & Info Card */}
        <div className="flex-1 order-1 space-y-8">
          {/* ✨ Description Section with unique accent */}
          <div className="relative group">
            <div className="absolute left-1 top-0 w-1 md:w-1.5 h-full bg-gradient-to-b from-orange-500 to-yellow-500 rounded-tr-2xl rounded-br-2xl shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
            <div className="relative pl-6">
              <p
                className={`
        text-[13px] md:text-[15px] lg:text-[17px]
        leading-relaxed text-gray-200 transition-all duration-300
        group-hover:text-white
        ${showFullDescription ? "" : "line-clamp-3 md:line-clamp-3"}
      `}
              >
                {movie.longDescription}
              </p>
            </div>
            {/* Desktop Hover Tooltip */}
            <div
              className="
    hidden md:block
    absolute left-6 top-full mt-4
    w-[500px]

    opacity-0 invisible
    group-hover:opacity-100
    group-hover:visible

    translate-y-2
    group-hover:translate-y-0

    transition-all duration-300

    z-50
    pointer-events-none
  "
            >
              <div
                className="
      relative overflow-hidden

      rounded-[26px]

      border border-white/[0.10]

      bg-gradient-to-br
      from-zinc-950
      via-neutral-900
      to-neutral-950

      backdrop-blur-3xl

      px-6 py-5

      shadow-[0_10px_45px_rgba(0,0,0,0.45)]

      before:absolute
      before:inset-0
      before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_38%)]

      after:absolute
      after:inset-0
      after:bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.015),transparent)]

      before:pointer-events-none
      after:pointer-events-none
    "
              >
                {/* Subtle Orange Glow */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500/10 blur-[70px] rounded-full" />

                <p
                  className="
        relative z-10

        text-[14px]
        leading-8
        tracking-[0.01em]

        text-zinc-200
      "
                >
                  {movie.longDescription}
                </p>
              </div>
            </div>
            {/* Mobile Read More */}
            {movie.longDescription?.length > 120 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="
          md:hidden
          mt-1 pl-6
          text-orange-400
          text-[12px]
          font-semibold
          tracking-wide
          active:scale-95
          transition-all
        "
              >
                {showFullDescription ? "Read Less" : "Read More"}
              </button>
            )}
          </div>

          {/* 📋 Modern Credits Card */}
          <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-md rounded-2xl p-2 shadow-2xl overflow-hidden relative">
            {/* Background glow effect */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-500/5 blur-[80px] rounded-full" />

            <div className="divide-y divide-white/5">
              {/* Director Row */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-white/5 hover:bg-white/[0.02] transition-all px-4 rounded-2xl">
                <div className="flex items-center gap-4 sm:w-40 shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-orange-500 group-hover:text-black transition-all duration-500">
                    <LuClapperboard size={16} />
                  </div>
                  <span className="font-bold text-zinc-200 text-[13px] md:text-[15px]  tracking-[1px]">
                    Director
                  </span>
                </div>
                <div className="flex-1">
                  <span className="px-3 py-1 border border-gray-700 text-zinc-400 rounded-md text-[13px] md:text-[14px] hover:bg-gray-800/50 transition-colors">
                    {movie.director || "N/A"}
                  </span>
                </div>
              </div>

              {/* Writer Row */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-white/5 hover:bg-white/[0.02] transition-all px-4 rounded-2xl">
                <div className="flex items-center gap-4 sm:w-40 shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-orange-500 group-hover:text-black transition-all duration-500">
                    <Edit2 size={16} />
                  </div>
                  <span className="font-bold text-zinc-200 text-[13px] md:text-[14px]  tracking-[1px]">
                    Writer
                  </span>
                </div>
                <div className="flex-1">
                  <span className="px-3 py-1 border border-gray-700 text-zinc-400 rounded-md text-[13px] md:text-[14px] hover:bg-gray-800/50 transition-colors">
                    {movie.writer || "N/A"}
                  </span>
                </div>
              </div>

              {/* Cast Row (Special Handling for Multi-line) */}
              <div className=" flex flex-col sm:flex-row sm:items-center py-2 border-b border-white/5 hover:bg-white/[0.02] transition-all px-4 rounded-2xl">
                <div className="flex items-center gap-4 sm:w-40 shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-orange-500 group-hover:text-black transition-all duration-500">
                    <Users size={16} />
                  </div>
                  <span className="font-bold text-zinc-200 text-[13px] md:text-[15px]  tracking-[1px]">
                    Casts
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-white/5  transition-all  rounded-2xl">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 ml-11 md:ml-0">
                    {movie.cast ? (
                      movie.cast.split(",").map((star, index, array) => (
                        <React.Fragment key={index}>
                          <span className="px-3 py-1 border border-gray-700 text-zinc-400 rounded-md text-[13px] md:text-[14px] hover:bg-gray-800/50 transition-colors">
                            {star.trim()}
                          </span>
                          {/* {index < array.length - 1 && (
                            <span className="w-1 h-1 rounded-full bg-zinc-200 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                          )} */}
                        </React.Fragment>
                      ))
                    ) : (
                      <span className="text-zinc-600 italic">No cast info</span>
                    )}
                  </div>
                  {/* <ChevronRight className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" /> */}
                </div>
              </div>

              {/* Music Director Row */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-white/5 hover:bg-white/[0.02] transition-all px-4 rounded-2xl">
                <div className="flex items-center gap-4 sm:w-40 shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-orange-500 group-hover:text-black transition-all duration-500">
                    <Music size={16} />
                  </div>
                  <span className="font-bold text-zinc-200 text-[13px] md:text-[15px]  tracking-[1px]">
                    Music
                  </span>
                </div>
                <div className="flex-1">
                  <span className="px-3 py-1 border border-gray-700 text-zinc-400 rounded-md text-[13px] md:text-[14px] hover:bg-gray-800/50 transition-colors">
                    {movie.musicDirector || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar Actions */}
        <div className="w-full lg:w-80 shrink-0 order-2">
          <div className="sticky top-24 space-y-6">
            {/* 🚀 Watchlist Premium Card */}
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 rounded-[2rem] p-6 border border-white/10 shadow-xl">
              {/* <button
                onClick={() => setIsRatingModalOpen(true)}
                className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-neutral-950  py-4  rounded-2xl flex items-center justify-center gap-[7px] transition-all active:scale-95 shadow-lg shadow-yellow-500/20"
              >
                <Star size={20} fill="currentColor" className="shrink-0" />
                <span className="text-[14px] text-black/90 font-bold  uppercase">
                  Rate Now
                </span>
              </button> */}

              {userRatingLoading ? (
                <div
                  className="
      flex-1

      h-[56px]

      rounded-xl

      border border-white/5

      bg-zinc-800/70

      overflow-hidden

      relative
    "
                >
                  {/* SHIMMER */}

                  <div
                    className="
        absolute inset-0

        animate-pulse

        bg-gradient-to-r
        from-transparent
        via-white/[0.04]
        to-transparent
      "
                  />

                  {/* CONTENT */}

                  <div className="h-full flex items-center justify-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />

                    <div className="h-3 w-28 rounded-full bg-white/10 animate-pulse" />
                  </div>
                </div>
              ) : (
                <IsUserValid>
                  <button
                    disabled={alreadyRated || addMovieRatingMutation?.isPending}
                    onClick={() => {
                      if (alreadyRated || addMovieRatingMutation?.isPending)
                        return;
                      setIsRatingModalOpen(true);
                    }}
                    // பட்டனுக்கு 'overflow-hidden' அவசியம், அப்போதான் corner text வெளியே தெரியாது
                    className={`
      relative flex-1 py-4 w-full rounded-xl flex items-center justify-center gap-2 border transition-all duration-300 active:scale-95 overflow-hidden
      ${
        alreadyRated
          ? "bg-zinc-900 border-zinc-800 text-zinc-400 cursor-not-allowed pointer-events-none"
          : " bg-zinc-800 hover:bg-zinc-800/45 border-white/5  text-white cursor-pointer"
      }
      ${addMovieRatingMutation?.isPending ? "opacity-70 cursor-not-allowed" : ""}
    `}
                  >
                    {/* RATED RIBBON (Edge Corner) */}
                    {alreadyRated && (
                      <div
                        className="
      absolute
      top-0
      left-0
      w-16
      h-16
      overflow-hidden
      z-20
    "
                      >
                        <span
                          className="
        absolute
        top-[10px]
        -left-[18px]
        w-[80px]
        rotate-[-45deg]
        bg-gradient-to-r
        from-blue-700
        via-blue-500
        to-blue-300
        text-white
        text-[8px]
        font-black
        text-center
        py-[3px]
        uppercase
        tracking-wider
        shadow-[0_4px_15px_rgba(59,130,246,0.5)]
        border-t
        border-white/40
      "
                        >
                          Rated
                        </span>
                      </div>
                    )}

                    {addMovieRatingMutation?.isPending ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute w-5 h-5 rounded-full bg-yellow-500/20 blur-[6px] animate-pulse" />
                          <div
                            className="w-5 h-5 rounded-full border-[2px] border-white/10 border-t-yellow-500 border-r-yellow-400 animate-spin"
                            style={{
                              animation:
                                "spin 0.7s linear infinite, jelly 1.2s ease-in-out infinite",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <FaRegStar
                          size={16}
                          className={
                            alreadyRated ? "text-zinc-600" : "text-yellow-400"
                          }
                        />
                        <span className="text-xs uppercase font-bold tracking-widest">
                          {alreadyRated ? "Already Rated" : "Rate Now"}
                        </span>
                      </>
                    )}
                  </button>
                </IsUserValid>
              )}

              <div className="mt-4 flex items-center justify-center gap-4">
                {/* ====================================================== */}
                {/* ✅ LOADING SKELETON */}
                {/* ====================================================== */}

                {watchedLoading ? (
                  <div
                    className="
        flex-1

        h-[56px]

        rounded-xl

        border border-white/5

        bg-zinc-800/70

        overflow-hidden

        relative
      "
                  >
                    {/* SHIMMER */}

                    <div
                      className="
          absolute inset-0

          animate-pulse

          bg-gradient-to-r
          from-transparent
          via-white/[0.04]
          to-transparent
        "
                    />

                    {/* CONTENT */}

                    <div className="h-full flex items-center justify-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />

                      <div className="h-3 w-28 rounded-full bg-white/10 animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <IsUserValid>
                    <button
                      disabled={toggleMarkWatchedMutation?.isPending}
                      onClick={() => {
                        if (toggleMarkWatchedMutation?.isPending) {
                          return;
                        }

                        toggleMarkWatchedMutation.mutate();
                      }}
                      className={`
      relative
      overflow-hidden

      flex-1
      py-4
      rounded-xl

      flex items-center justify-center gap-2

      cursor-pointer

      border

      transition-all duration-300

      active:scale-95

      ${
        isWatched
          ? `
            bg-zinc-900 border-zinc-800 text-zinc-400 
          `
          : `
            bg-zinc-800

            hover:bg-zinc-800/45

            border-white/5

            text-white
          `
      }

      ${
        toggleMarkWatchedMutation?.isPending
          ? "opacity-70 cursor-not-allowed"
          : ""
      }
    `}
                    >
                      {/* ============================================ */}
                      {/* WATCHED RIBBON */}
                      {/* ============================================ */}

                      {isWatched && (
                        <div
                          className="
      absolute
      top-0
      left-0
      w-16
      h-16
      overflow-hidden
      z-20
    "
                        >
                          <span
                            className="
        absolute
        top-[10px]
        -left-[18px]
        w-[80px]
        rotate-[-45deg]
        bg-gradient-to-r
        from-blue-700
        via-blue-500
        to-blue-300
        text-white
        text-[8px]
        font-black
        text-center
        py-[3px]
        uppercase
        tracking-wider
        shadow-[0_4px_15px_rgba(59,130,246,0.5)]
        border-t
        border-white/40
      "
                          >
                            Watched
                          </span>
                        </div>
                      )}

                      {/* ============================================ */}
                      {/* PENDING UI */}
                      {/* ============================================ */}

                      {toggleMarkWatchedMutation?.isPending ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="relative flex items-center justify-center">
                            <div className="absolute w-5 h-5 rounded-full bg-red-500/20 blur-[6px] animate-pulse" />

                            <div
                              className="w-5 h-5 rounded-full border-[2px] border-white/10 border-t-red-500 border-r-red-400 animate-spin"
                              style={{
                                animation:
                                  "spin 0.7s linear infinite, jelly 1.2s ease-in-out infinite",
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          {isWatched ? (
                            <Eye size={18} className="text-zinc-600" />
                          ) : (
                            <Eye size={18} className="text-blue-400" />
                          )}

                          <span className="text-xs font-bold uppercase tracking-wide">
                            {isWatched ? "Watched" : "Mark Watched"}
                          </span>
                        </>
                      )}
                    </button>
                  </IsUserValid>
                )}
              </div>
            </div>

            {/* --- Rating Modal Implementation --- */}
            <AnimatePresence>
              {isRatingModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                  {/* 2. Backdrop - Only for background black/blur effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsRatingModalOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-md "
                  />
                  {/* 3. Modal Content - Ithu ippo center-la irukkum */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative z-[101]  bg-zinc-900/90 border  border-white/10 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-2xl mt-20 mx-6 "
                  >
                    {/* Decorative Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48  bg-yellow-500/10 blur-[80px] rounded-full" />
                    <div className="relative z-10">
                      {/* Header Section with Close Button */}
                      <div className="flex justify-between items-start mb-4 ">
                        <div className="flex gap-4">
                          {/* Movie Mini Poster Thumbnail */}
                          <div className="w-16 h-20 rounded-xl overflow-hidden border border-white/10 shadow-lg shrink-0">
                            <img
                              src={youtubeThumbnail}
                              alt="Trailer Thumbnail"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = movie.posterPath;
                              }} // Error handle
                            />
                          </div>

                          {/* Title & Info */}
                          <div className="flex flex-col justify-center">
                            <h3 className="text-2xl text-white leading-tight truncate tracking-tight">
                              {movie.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-zinc-500 text-xs font-medium">
                                {movie.releaseYear}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Close Button */}
                        <button
                          onClick={() => setIsRatingModalOpen(false)}
                          className="p-2.5 bg-white/5 hover:bg-white/10 border cursor-pointer border-white/5 rounded-full transition-all group active:scale-90"
                        >
                          <X
                            size={18}
                            className="text-zinc-400 group-hover:text-white"
                          />
                        </button>
                      </div>

                      {/* Divider */}
                      {/* <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" /> */}

                      {/* Dynamic Helper Text */}
                      <div className="text-center mb-5 md:mb-8 min-h-[50px] flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={feedback.text + feedback.emoji} // Key change aagum pothu trigger aagum
                            initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                          >
                            <span className="text-2xl drop-shadow-md">
                              {feedback.emoji}
                            </span>

                            <p className="font-medium tracking-wide">
                              {isActive ? (
                                <span className="flex items-center gap-1.5">
                                  <span className="text-white/60 text-[13px]">
                                    You're giving it
                                  </span>
                                  <span className="text-white text-[11px] bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                                    {hover || rating}/10
                                  </span>
                                  {/* <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent italic">
                                    {feedback.text}
                                  </span> */}
                                </span>
                              ) : (
                                <span className="text-zinc-500 text-[10px] md:text-[13px] italic">
                                  {feedback.text}
                                </span>
                              )}
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      {/* 10 Stars Section - Inga unga star logic varum */}
                      <div className="flex flex-wrap justify-center gap-2.5 mb-4 md:mb-8">
                        {/* Star Mapping Here */}
                        {[...Array(10)].map((_, index) => {
                          const starValue = index + 1;
                          return (
                            <button
                              key={index}
                              onMouseEnter={() => setHover(starValue)}
                              onMouseLeave={() => setHover(0)}
                              onClick={() => {
                                if (addMovieRatingMutation?.isPending) {
                                  return;
                                }

                                setSelectedRating(starValue);
                              }}
                              className="group relative transition-transform active:scale-3d duration-200 cursor-pointer "
                            >
                              <FaStar
                                className={`transition-all duration-500 ease-out group-hover:rotate-[180deg] group-hover:scale-150 text-[22px] md:text-[25px]
                                  ${
                                    starValue <= (hover || selectedRating)
                                      ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                                      : "text-zinc-700"
                                  }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                      {/* Comment box added if rating selected */}
                      <AnimatePresence>
                        {selectedRating > 0 && (
                          <motion.div>
                            <textarea
                              disabled={addMovieRatingMutation?.isPending}
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              placeholder="Write your experience..."
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-colors resize-none h-24"
                            />

                            {/* <button
                              disabled={!comment.trim()}
                              // onClick={handleSubmitRating}
                              className={`w-full py-4 rounded-2xl text-[14px] md:text-[16px] font-bold flex items-center justify-center gap-2 transition-all ${
                                comment.trim()
                                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 active:scale-95"
                                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                              }`}
                            >
                              <Send size={18} />
                              SUBMIT REVIEW
                            </button> */}
                            <button
                              disabled={
                                !selectedRating ||
                                addMovieRatingMutation?.isPending
                              }
                              onClick={handleSubmitMovieRating}
                              className={`
                                w-full

                                h-[52px]

                                rounded-2xl

                                font-semibold

                                transition-all duration-300

                                flex items-center justify-center gap-2

    ${
      addMovieRatingMutation?.isPending
        ? `
          bg-yellow-500/60
          cursor-not-allowed
        `
        : `
          bg-yellow-500
          hover:bg-yellow-400
          text-black
        `
    }
  `}
                            >
                              {/* ======================================== */}
                              {/* ✅ LOADING */}
                              {/* ======================================== */}

                              {addMovieRatingMutation?.isPending ? (
                                <>
                                  <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />

                                  <span>Submitting Rating...</span>
                                </>
                              ) : (
                                <>
                                  <Send size={18} />

                                  <span>Submit Rating</span>
                                </>
                              )}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* 📊 Quick Stats (Optional but attractive) */}
            <div className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-5 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />

              <div className="flex items-center gap-2 mb-6">
                <IoAnalytics
                  className="
      text-blue-400
      text-[16px]
      drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]
    "
                />

                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[2px]">
                  Movie Analytics
                </h4>
              </div>

              {analyticsLoading ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 h-16 rounded-xl bg-white/5 animate-pulse" />
                  <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

                  <div className="flex-1 h-16 rounded-xl bg-white/5 animate-pulse" />
                </div>
              ) : (
                <div className="flex items-center justify-around relative z-10">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <span className="block text-2xl  text-white tracking-tight">
                        {formatViews(totalViews)}
                      </span>
                      <div className="absolute -bottom-1 -left-5 w-[55px] h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                    </div>
                    <span className="text-[10px] flex items-center gap-1 font-bold text-zinc-500 uppercase mt-3 tracking-widest">
                      <FaEye
                        className="
        text-blue-400
        text-[15px]
        drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]
      "
                      />{" "}
                      Views
                    </span>
                  </div>

                  <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />

                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <span className="block text-2xl  text-white tracking-tight">
                        {formatAvgTime(averageTimeSpent)}
                      </span>
                      <div className="absolute -bottom-1 -left-2  w-[55px] h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
                    </div>
                    <span className="text-[10px] flex gap-1 font-bold text-zinc-500 uppercase mt-3 tracking-widest">
                      <LuTimerReset
                        className="
         text-blue-400
        text-[15px]
        drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]
      "
                      />{" "}
                      Avg Time
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDescriptionSection;
