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
import { IoNotificationsOutline, IoTicketOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import IsUserValid from "../ProtectedRoute/IsUserValid";
import { IoAnalytics } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa6";

// ============================================================
// ✅ STATIC BOOKING PLATFORMS
// ============================================================
export const BOOKING_PLATFORMS = [
  {
    id: "bookmyshow",
    name: "BookMyShow",
    description:
      "India's most popular movie ticket booking platform with advance booking, seat selection, and support for Tamil, Telugu, Hindi, Malayalam, Kannada, English, PVR, INOX, Cinepolis, and local theatres.",
    logo: "https://play-lh.googleusercontent.com/FPtxFPnbUNmOPvggNFaTUGPUr4DAb-djW6uWgG8lST76KTmZYko679Oh5g15gr4KAUZH",
    url: "https://in.bookmyshow.com",
  },
  {
    id: "ticketnew",
    name: "TicketNew",
    description:
      "Popular movie ticket booking platform in South India. Supports Tamil Nadu, Andhra Pradesh, Telangana theatres and latest Tamil, Telugu, and Malayalam movie bookings.",
    logo: "https://play-lh.googleusercontent.com/7g1mR_Od0qNRfiEN4MsSSKyb8d1MB3GrvShoKKOCrGituQ2d73IMcnim9J3lHlWDHJA",
    url: "https://www.ticketnew.com",
  },
  {
    id: "justickets",
    name: "Justickets",
    description:
      "Simple and easy ticket booking platform supporting Chennai, Hyderabad, and many South Indian cities with regional language movie bookings.",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqNRAH4e4ejWE8TfZ_9qInwBy48y3IXm-c6g&s",
    url: "https://www.justickets.in",
  },
  {
    id: "paytmmovies",
    name: "Paytm Movies",
    description:
      "Book movie tickets with cashback offers, UPI payments, and support for multiple language films across India.",
    logo: "https://lh3.googleusercontent.com/4cirCnWMWJCW6GrRd7speycXv7yoq38u8U9SDtp6pOfQVVUEyM1c6pEUWm7hqYeFzfzyfL9XHVkZHrpl7HoGHPLePQU=w256-rw",
    url: "https://movies.paytm.com",
  },
  {
    id: "pvrinox",
    name: "PVR INOX Cinemas",
    description:
      "Official booking platform for PVR and INOX theatres with IMAX, 4DX, and premium screen experiences.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Pvrcinemas_logo.jpg",
    url: "https://www.pvrcinemas.com",
  },
];

const MovieDescriptionSection = ({
  movie,
  isRatingModalOpen,
  setIsRatingModalOpen,
  watchedData,
  watchedLoading,
  watchedError,
  toggleMarkWatchedMutation,
  userRatingData,
  userRatingLoading,
  userRatingError,
  addMovieRatingMutation,
  isInWatchlist,
  watchlistLoading,
  watchlistError,
  toggleWatchlistMutation,
  refetchWatchlist,
  analyticsData,
  analyticsLoading,
  analyticsFetching,
  currentUserReview,
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showWatchPopup, setShowWatchPopup] = useState(false);
  const [activeCreditTooltip, setActiveCreditTooltip] = useState(null);
  // ============================================================
  // ✅ NEW: Book Now Popup State
  // ============================================================
  const [showBookPopup, setShowBookPopup] = useState(false);
  const [showRatingTooltip, setShowRatingTooltip] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeID(movie.trailerUrl);
  const youtubeThumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : movie.posterPath;

  useEffect(() => {
    if (isRatingModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isRatingModalOpen]);

  const parseData = (data) => {
    try {
      let result = data;
      while (typeof result === "string") {
        result = JSON.parse(result);
      }
      return Array.isArray(result) ? result : [];
    } catch {
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
      logo: "/ott/aha.jpeg",
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
      logo: "/ott/hungamaplay.jpeg",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "jiohotstar",
      name: "jiohotstar",
      logo: "/ott/jiohotstar.avif",
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
      logo: "/ott/mxplayer.jpeg",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "netflix",
      name: "netflix",
      logo: "/ott/netflix.avif",
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
      logo: "/ott/prime.avif",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "sony",
      name: "sony",
      logo: "/ott/sonyliv.jpeg",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
    {
      id: "sunnxt",
      name: "sunNxt",
      logo: "/ott/sunnxt.jpeg",
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
      logo: "/ott/zee5.avif",
      className: "w-12 h-12 rounded-lg border object-contain",
    },
  ];

  const handleSubmitMovieRating = () => {
    if (addMovieRatingMutation?.isPending) return;
    if (!selectedRating) return;
    addMovieRatingMutation.mutate(
      { movieId: movie?.id, rating: selectedRating, review: reviewText },
      {
        onSuccess: () => {
          setIsRatingModalOpen(false);
          setSelectedRating(0);
          setReviewText("");
        },
      },
    );
  };

  const isWatched = watchedData?.watched;
  const alreadyRated = userRatingData?.rated;

  const formatViews = (num = 0) => {
    if (num >= 1000000000)
      return `${(num / 1000000000).toFixed(1).replace(".0", "")}B`;
    if (num >= 1000000)
      return `${(num / 1000000).toFixed(1).replace(".0", "")}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1).replace(".0", "")}K`;
    return num.toString();
  };

  const formatAvgTime = (seconds = 0) => {
    if (!seconds) return "0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${secs}s`;
  };

  const totalViews = analyticsData?.totalViews || 0;
  const averageTimeSpent = analyticsData?.averageTimeSpent || 0;

  const availablePlatforms = Array.isArray(movie?.availableOn)
    ? movie.availableOn.filter((item) => item?.url && item.url.trim() !== "")
    : [];
  const hasWatchUrl = availablePlatforms.length > 0;

  // ============================================================
  // ✅ Is THEATRICAL mode?
  // ============================================================
  const isTheatrical = movie.releaseMode === "THEATRICAL";
  const availableOTTs = Array.isArray(movie?.availableOn)
    ? movie.availableOn
    : [];
  const matchedOTTs = availableOTTs
    .map((ott) => {
      const ottId = typeof ott === "string" ? ott : ott?.id;
      return STREAMING_PLATFORMS.find(
        (platform) =>
          platform.id?.toLocaleLowerCase() === ottId?.toLocaleLowerCase(),
      );
    })
    .filter(Boolean);
  const isUpcomingMovie = movie?.streamType === "UPCOMING";
  const disableRating =
    isUpcomingMovie || alreadyRated || addMovieRatingMutation?.isPending;

  return (
    <div className="pt-6 bg-[#121212] space-y-4 mb-8 text-white">
      {/* --- Action Buttons Section --- */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6 md:p-6 shadow-2xl">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 blur-[100px] rounded-full" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-4 md:gap-10">
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            <div className="flex gap-2 w-full">
              {/* ============================================================ */}
              {/* ✅ PRIMARY ACTION BUTTON — UPCOMING / THEATRICAL / OTT        */}
              {/* ============================================================ */}

              {movie.streamType === "UPCOMING" ? (
                // ---- REMIND ME ----
                <button className="group relative flex flex-1 md:flex-none items-center justify-center cursor-pointer gap-2 px-4 py-2 md:px-10 rounded-lg md:rounded-xl text-white text-[10px] md:text-[13px] bg-blue-600 transition-all duration-300 hover:shadow-[0_0_10px_10px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-95">
                  <span className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <IoNotificationsOutline className="relative z-10 text-[17px] md:text-[15px] group-hover:animate-bounce" />
                  <span className="relative z-10 text-[12px]">REMIND ME</span>
                </button>
              ) : isTheatrical ? (
                // ---- BOOK NOW (Theatrical) ----
                <button
                  onClick={() => setShowBookPopup(true)}
                  className="group relative flex flex-1 md:flex-none items-center justify-center cursor-pointer gap-2 px-4 py-1 md:px-10 rounded-lg md:rounded-xl text-white text-[10px] md:text-[13px] bg-blue-600 transition-all duration-300 hover:shadow-[0_0_10px_10px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-95"
                >
                  <span className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  {/* Ticket icon SVG */}
                  <IoTicketOutline className="relative z-10 text-[20px] md:text-[24px]" />
                  <span className="relative z-10 text-[12px]">BOOK NOW</span>
                </button>
              ) : (
                // ---- WATCH NOW (OTT) ----
                <button
                  onClick={() => {
                    if (!hasWatchUrl) return;
                    if (availablePlatforms.length === 1) {
                      window.open(availablePlatforms[0].url, "_blank");
                      return;
                    }
                    setShowWatchPopup(true);
                  }}
                  disabled={!hasWatchUrl}
                  className={`
                    group relative flex flex-1 md:flex-none items-center justify-center gap-1
                    px-4 py-1 md:px-10 rounded-lg md:rounded-xl text-white
                    transition-all duration-300
                    ${
                      !hasWatchUrl
                        ? "bg-zinc-700 opacity-50 cursor-not-allowed"
                        : "bg-orange-500 hover:shadow-[0_0_10px_5px_rgba(249,115,22,0.4)] hover:scale-[1.02] active:scale-95"
                    }
                  `}
                >
                  <span className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <FaPlay className="relative z-10 text-[17px] md:text-[15px]" />
                  <span className="relative z-10 text-[12px]">WATCH NOW</span>
                </button>
              )}

              {/* ====================================================== */}
              {/* ✅ WATCHLIST BUTTON */}
              {/* ====================================================== */}
              <IsUserValid>
                {watchlistLoading ? (
                  <div className="flex-1 h-[52px] rounded-lg md:rounded-xl border border-white/10 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black/40 overflow-hidden px-20 relative">
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
                    <div className="relative z-10 h-full flex items-center justify-center gap-3">
                      <div className="flex items-center gap-2">
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
                    </div>
                  </div>
                ) : (
                  <motion.button
                    layout
                    disabled={toggleWatchlistMutation?.isPending}
                    onClick={() => {
                      if (toggleWatchlistMutation?.isPending) return;
                      toggleWatchlistMutation.mutate();
                    }}
                    className={`
                      group cursor-pointer relative flex-none md:flex-1
                      flex items-center justify-center gap-2
                      px-4 py-2.5 md:py-4 md:px-10
                      rounded-lg md:rounded-xl text-white text-[10px] md:text-[13px]
                      border shadow-2xl transition-all duration-500 hover:-translate-y-0.5 active:scale-95 overflow-hidden
                      ${
                        isInWatchlist
                          ? "bg-gradient-to-br from-red-500/15 via-zinc-900 to-black/40 border-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.12)]"
                          : "bg-gradient-to-br from-zinc-800 via-zinc-900 to-black/40 border-white/10 hover:border-white/30 hover:shadow-[0_0_30px_5px_rgba(255,255,255,0.15)]"
                      }
                      ${toggleWatchlistMutation?.isPending ? "opacity-70 cursor-not-allowed" : ""}
                    `}
                  >
                    <span className="absolute inset-0 rounded-lg md:rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.div
                      key={isInWatchlist ? "added" : "default"}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.35 }}
                    >
                      <IoMdHeartEmpty
                        className={`relative z-10 text-[20px] md:text-[23px] transition-all duration-300 ${isInWatchlist ? "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" : "text-zinc-400 group-hover:text-red-500"}`}
                      />
                    </motion.div>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={
                          toggleWatchlistMutation?.isPending
                            ? "updating"
                            : isInWatchlist
                              ? "remove"
                              : "watchlist"
                        }
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`relative z-10 tracking-widest text-[12px] transition-colors duration-300 hidden md:inline-block ${isInWatchlist ? "text-red-400" : "text-white"}`}
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

          {/* Language Section */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start lg:items-center gap-4 mt-[-4px] md:mt-0">
            <div className="hidden lg:block w-[1px] h-12 bg-white/10 mx-2" />
            <div className="group relative flex flex-wrap items-center justify-start gap-2 p-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black/40 border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-[0_0_25px_5px_rgba(255,255,255,0.12)] hover:border-white/20">
              <span className="absolute inset-0 rounded-xl md:rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
              <div className="relative z-10 flex flex-wrap items-center gap-2 md:gap-3">
                {availableLanguages.map((lang, idx) => (
                  <div key={idx} className="flex items-center gap-2 md:gap-3">
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
          <div className="flex flex-wrap items-center gap-2 md:ml-3">
            {/* THEATRE CARD */}

            {(movie?.isTheatreReleased ||
              (movie?.isStreamingReleased && matchedOTTs.length > 0)) && (
              <div
                className="
      relative
      flex
      flex-col

      px-4 md:px-5
      py-2.5 md:py-3

      rounded-xl
      md:rounded-2xl

      bg-gradient-to-br
      from-zinc-800
      via-zinc-900
      to-black/40

      border
      border-white/10

      shadow-2xl
    "
              >
                {/* Title */}
                <span
                  className="
        text-[9px]
        md:text-[10px]

        uppercase
        tracking-[0.25em]

        text-zinc-500

        mb-2 md:mb-3
      "
                >
                  Availability
                </span>

                <div className="flex items-center flex-wrap gap-3">
                  {/* Theatre */}
                  {movie?.isTheatreReleased && (
                    <>
                      <div className="flex items-center gap-2">
                        <LuClapperboard className="text-orange-400 text-[15px]" />

                        <span
                          className="
                text-[10px]
                uppercase
                font-semibold
                tracking-wider
                text-orange-300
              "
                        >
                          Theatre
                        </span>
                      </div>

                      {movie?.isStreamingReleased && matchedOTTs.length > 0 && (
                        <div className="w-px h-8 bg-white/10" />
                      )}
                    </>
                  )}

                  {/* OTT Platforms */}
                  {movie?.isStreamingReleased && matchedOTTs.length > 0 && (
                    <div className="flex items-center gap-3">
                      {matchedOTTs.map((ott, index) => (
                        <React.Fragment key={ott.id}>
                          <img
                            src={ott.logo}
                            alt={ott.name}
                            className="
                    h-8 md:h-9
                    w-auto
                    object-contain
                    rounded-md
                  "
                          />

                          {index !== matchedOTTs.length - 1 && (
                            <span className="text-zinc-600 text-base">|</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ✅ WATCH NOW POPUP (OTT)                                      */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showWatchPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWatchPopup(false)}
            />

            {/* MOBILE BOTTOM SHEET */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed -bottom-5 left-0 right-0 md:hidden z-[9999] rounded-t-[2rem] border-t border-white/10 bg-[#111] flex flex-col"
              style={{ maxHeight: "75vh" }}
            >
              {/* Handle Bar */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-4 mb-2 shrink-0" />

              {/* Header — fixed */}
              <div className="flex items-center justify-between px-6 py-4 shrink-0">
                <div>
                  <h3 className="text-white text-base font-bold tracking-wide">
                    Watch On
                  </h3>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    Choose your platform
                  </p>
                </div>
                <button
                  onClick={() => setShowWatchPopup(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <X size={16} className="text-zinc-400" />
                </button>
              </div>

              {/* Scrollable List */}
              <div className="overflow-y-auto flex-1 px-6 pb-8 space-y-3 custom-scrollbar">
                {availablePlatforms.map((platform, i) => {
                  const platformInfo = STREAMING_PLATFORMS.find(
                    (p) => p.id === platform.id,
                  );
                  return (
                    <motion.button
                      key={platform.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => {
                        window.open(platform.url, "_blank");
                        setShowWatchPopup(false);
                      }}
                      className="w-full flex items-center gap-4 p-3.5 rounded-2xl bg-zinc-900 border border-white/5 hover:border-orange-500/40 hover:bg-zinc-800 transition-all active:scale-95"
                    >
                      <img
                        src={platformInfo?.logo}
                        alt={platform.name}
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-white uppercase font-semibold text-sm">
                          {platform.name}
                        </span>
                        <span className="text-zinc-500 text-[11px]">
                          Tap to watch
                        </span>
                      </div>
                      <div className="ml-auto p-1.5 rounded-lg bg-zinc-400/10">
                        <FaPlay className="text-zinc-100 text-[9px]" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* DESKTOP DROPDOWN */}
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.94 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="hidden md:block absolute md:top-[137%] lg:top-[110%] left-[234px] mt-2 w-[320px] z-[999] rounded-2xl border border-white/10 bg-[#141414] backdrop-blur-xl p-4 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
            >
              {/* <div className="absolute top-[50px] -left-1.5 w-3.5 h-3.5 -rotate-[45deg] bg-[#141414] border-l border-t border-white/10" /> */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h3 className="text-white text-sm font-bold tracking-wide">
                    Watch On
                  </h3>
                  <p className="text-zinc-600 text-[11px]">Select a platform</p>
                </div>
                <button
                  onClick={() => setShowWatchPopup(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-all"
                >
                  <X size={14} className="text-zinc-500" />
                </button>
              </div>
              <div className="space-y-2">
                {availablePlatforms.map((platform, i) => {
                  const platformInfo = STREAMING_PLATFORMS.find(
                    (p) => p.id === platform.id,
                  );
                  return (
                    <motion.button
                      key={platform.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        window.open(platform.url, "_blank");
                        setShowWatchPopup(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-white/5 hover:border-orange-500/30 hover:bg-zinc-800 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-lg shrink-0">
                        <img
                          src={platformInfo?.logo}
                          alt={platform.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-white uppercase font-semibold text-[13px]">
                          {platform.name}
                        </span>
                        <span className="text-zinc-600 text-[10px]">
                          Click to watch
                        </span>
                      </div>
                      <div className="ml-auto p-1.5 rounded-lg bg-zinc-400/10">
                        <FaPlay className="relative z-10 text-[14px]" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* ✅ BOOK NOW POPUP (THEATRICAL)                                */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showBookPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookPopup(false)}
              // className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            />

            {/* MOBILE BOTTOM SHEET */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed -bottom-5 left-0 right-0 md:hidden z-[9999] rounded-t-[2rem] border-t border-white/10 bg-[#111] flex flex-col"
              style={{ maxHeight: "75vh" }}
            >
              {/* Handle Bar */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-4 mb-2 shrink-0" />

              {/* Header — fixed, no scroll */}
              <div className="flex items-center justify-between px-6 py-4 shrink-0">
                <div>
                  <h3 className="text-white text-base font-bold tracking-wide">
                    Book Tickets
                  </h3>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    Choose a booking platform
                  </p>
                </div>
                <button
                  onClick={() => setShowBookPopup(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <X size={16} className="text-zinc-400" />
                </button>
              </div>

              {/* Scrollable List */}
              <div className="overflow-y-auto flex-1 px-6 pb-8 space-y-3 custom-scrollbar">
                {BOOKING_PLATFORMS.map((platform, i) => (
                  <motion.button
                    key={platform.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => {
                      window.open(platform.url, "_blank");
                      setShowBookPopup(false);
                    }}
                    className="w-full flex items-center gap-4 p-3.5 rounded-2xl bg-zinc-900 border border-white/5 hover:border-blue-500/40 hover:bg-zinc-800 transition-all active:scale-95"
                  >
                    <img
                      src={platform.logo}
                      alt={platform.name}
                      className="w-11 h-11 rounded-xl object-cover bg-zinc-800"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-white font-semibold text-sm">
                        {platform.name}
                      </span>
                      <span className="text-zinc-500 text-[11px]">
                        Tap to book
                      </span>
                    </div>
                    <div className="ml-auto p-1.5 rounded-lg bg-zinc-400/10">
                      <IoTicketOutline className="relative z-10 text-[18px] md:text-[20px]" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* DESKTOP DROPDOWN */}
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.94 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="hidden md:block absolute md:top-[137%] lg:top-[110%] left-[235px] mt-2 w-[320px] z-[999] rounded-2xl border border-white/10 bg-[#141414] backdrop-blur-xl p-4 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
            >
              {/* Arrow notch */}
              {/* <div className="absolute top-[50px] -left-1.5 w-3.5 h-3.5 -rotate-[45deg] bg-[#141414] border-l border-t border-white/10" /> */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h3 className="text-white text-sm font-bold tracking-wide">
                    Book Tickets
                  </h3>
                  <p className="text-zinc-600 text-[11px]">
                    Select a booking platform
                  </p>
                </div>
                <button
                  onClick={() => setShowBookPopup(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-all"
                >
                  <X size={14} className="text-zinc-500" />
                </button>
              </div>
              <div className="space-y-2">
                {BOOKING_PLATFORMS.map((platform, i) => (
                  <motion.button
                    key={platform.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      window.open(platform.url, "_blank");
                      setShowBookPopup(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-white/5 hover:border-blue-500/30 hover:bg-zinc-800 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-lg shrink-0 bg-zinc-800 flex items-center justify-center">
                      <img
                        src={platform.logo}
                        alt={platform.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-white font-semibold text-[13px]">
                        {platform.name}
                      </span>
                      <span className="text-zinc-600 text-[10px]">
                        Click to book
                      </span>
                    </div>
                    <div className="ml-auto p-1.5 rounded-lg bg-zinc-400/10">
                      <IoTicketOutline className="relative z-10 text-[18px] md:text-[20px]" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 mt-10">
        {/* Left Side */}
        <div className="flex-1 order-1 space-y-8">
          {/* Description */}
          <div className="relative group">
            <div className="absolute left-1 top-0 w-1 md:w-1.5 h-full bg-gradient-to-b from-orange-500 to-yellow-500 rounded-tr-2xl rounded-br-2xl shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
            <div className="relative pl-6">
              <p
                className={`text-[13px] md:text-[15px] lg:text-[17px] leading-relaxed text-gray-200 transition-all duration-300 group-hover:text-white ${showFullDescription ? "" : "line-clamp-3 md:line-clamp-3"}`}
              >
                {movie.longDescription}
              </p>
            </div>
            <div className="hidden md:block absolute left-6 top-full mt-4 w-[500px] opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50 pointer-events-none">
              <div className="relative overflow-hidden rounded-[26px] border border-white/[0.10] bg-gradient-to-br from-zinc-950 via-neutral-900 to-neutral-950 backdrop-blur-3xl px-6 py-5 shadow-[0_10px_45px_rgba(0,0,0,0.45)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_38%)] after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.015),transparent)] before:pointer-events-none after:pointer-events-none">
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500/10 blur-[70px] rounded-full" />
                <p className="relative z-10 text-[14px] leading-8 tracking-[0.01em] text-zinc-200">
                  {movie.longDescription}
                </p>
              </div>
            </div>
            {movie.longDescription?.length > 120 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="md:hidden mt-1 pl-6 text-orange-400 text-[12px] font-semibold tracking-wide active:scale-95 transition-all"
              >
                {showFullDescription ? "Read Less" : "Read More"}
              </button>
            )}
          </div>

          {/* Credits Card */}
          <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-md rounded-2xl p-2 shadow-2xl overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-500/5 blur-[80px] rounded-full" />
            <div className="divide-y divide-white/5">
              {[
                {
                  icon: <LuClapperboard size={16} />,
                  label: "Director",
                  value: movie.director,
                },
                {
                  icon: <Edit2 size={16} />,
                  label: "Writer",
                  value: movie.writer,
                },
                {
                  icon: <Music size={16} />,
                  label: "Music",
                  value: movie.musicDirector,
                },
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-row items-center gap-3 md:gap-0 py-2 border-b border-white/5 hover:bg-white/[0.02] transition-all px-4 rounded-2xl"
                >
                  <div className="flex items-center gap-4 sm:w-40 shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                      {icon}
                    </div>
                    <span className="font-bold text-zinc-200 text-[13px] md:text-[15px] tracking-[1px]">
                      {label}
                    </span>
                  </div>
                  <div className="flex-1 relative">
                    <div>
                      <span
                        onClick={() =>
                          setActiveCreditTooltip(
                            activeCreditTooltip === label ? null : label,
                          )
                        }
                        className="px-3 py-1 block md:inline border w-[180px] md:w-full  truncate border-gray-700 text-zinc-400 rounded-md text-[13px] md:text-[14px] hover:bg-gray-800/50 transition-colors"
                      >
                        {value || "N/A"}
                      </span>
                    </div>
                    <AnimatePresence>
                      {activeCreditTooltip === label && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.2 }}
                          className="
          md:hidden
          absolute
          -left-3
          top-full
          mt-3
          z-50
          min-w-[240px]
          max-w-[300px]
        "
                        >
                          <div
                            className="fixed inset-0 z-[-1]"
                            onClick={() => setActiveCreditTooltip(null)}
                          />

                          <div
                            className="
          relative
          overflow-hidden
          rounded-[20px]
          border border-white/10
          bg-gradient-to-br
          from-zinc-950
          via-neutral-900
          to-neutral-950
          backdrop-blur-3xl
          px-4 py-3
          shadow-[0_10px_40px_rgba(0,0,0,0.5)]
        "
                          >
                            <div
                              className="
            absolute
            -top-8
            -right-8
            w-20
            h-20
            bg-orange-500/10
            blur-[50px]
            rounded-full
          "
                            />

                            <p
                              className="
            relative z-10
            text-[14px]
            leading-6
            font-semibold
            text-zinc-100
            break-words
          "
                            >
                              {value}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
              {/* Cast Row */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-white/5 hover:bg-white/[0.02] transition-all px-4 rounded-2xl">
                <div className="flex items-center gap-4 sm:w-40 shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Users size={16} />
                  </div>
                  <span className="font-bold text-zinc-200 text-[13px] md:text-[15px] tracking-[1px]">
                    Casts
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 ml-11 md:ml-0 py-2">
                  {movie.cast ? (
                    movie.cast.split(",").map((star, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 border border-gray-700 text-zinc-400 rounded-md text-[13px] md:text-[14px] hover:bg-gray-800/50 transition-colors"
                      >
                        {star.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-600 italic">No cast info</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 shrink-0 order-2">
          <div className="sticky top-24 space-y-6">
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 rounded-[2rem] p-6 border border-white/10 shadow-xl">
              {userRatingLoading ? (
                <div className="flex-1 h-[56px] rounded-xl border border-white/5 bg-zinc-800/70 overflow-hidden relative">
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
                  <div className="h-full flex items-center justify-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />
                    <div className="h-3 w-28 rounded-full bg-white/10 animate-pulse" />
                  </div>
                </div>
              ) : (
                <IsUserValid>
                  <div className="relative flex-1 group">
                    <button
                      disabled={disableRating}
                      onClick={() => {
                        if (isUpcomingMovie) {
                          setShowRatingTooltip(!showRatingTooltip);
                          return;
                        }

                        if (disableRating) return;

                        setIsRatingModalOpen(true);
                      }}
                      className={`relative flex-1 py-4 w-full rounded-xl flex items-center justify-center gap-2 border transition-all duration-300 active:scale-95 overflow-hidden ${alreadyRated ? "bg-zinc-900 border-zinc-800 text-zinc-400 cursor-not-allowed pointer-events-none" : "bg-zinc-800 hover:bg-zinc-800/45 border-white/5 text-white cursor-pointer"} ${addMovieRatingMutation?.isPending ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {alreadyRated && !isUpcomingMovie && (
                        <div className="absolute top-[12px] -left-[20px] w-[90px] rotate-[-45deg] bg-gradient-to-r from-zinc-950 to-zinc-800 text-center py-[4px] border-t border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.25)] backdrop-blur-sm">
                          <div className="flex justify-center gap-[2px]">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <FaStar
                                key={i}
                                size={10}
                                className={
                                  i <=
                                  Math.round(
                                    (currentUserReview?.rating || 0) / 2,
                                  )
                                    ? "text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]"
                                    : "text-zinc-700"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {addMovieRatingMutation?.isPending ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="relative flex items-center justify-center">
                            <div className="absolute w-5 h-5 rounded-full bg-yellow-500/20 blur-[6px] animate-pulse" />
                            <div className="w-5 h-5 rounded-full border-[2px] border-white/10 border-t-yellow-500 border-r-yellow-400 animate-spin" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <FaRegStar
                            size={16}
                            className={
                              disableRating
                                ? "text-zinc-600"
                                : "text-yellow-400"
                            }
                          />
                          <span className="text-xs uppercase font-bold tracking-widest">
                            {/* {alreadyRated ? "Already Rated" : "Rate Now"} */}
                            {isUpcomingMovie
                              ? "Not Released"
                              : alreadyRated
                                ? "Already Rated"
                                : "Rate Now"}
                          </span>
                        </>
                      )}
                    </button>
                    {isUpcomingMovie && (
                      <div
                        className="
                        w-[250px]
      hidden md:block
      absolute
      bottom-full
      left-1/2
      -translate-x-1/2
      mb-3
      opacity-0
      invisible
      group-hover:opacity-100
      group-hover:visible
      transition-all
      duration-300
      z-50
      pointer-events-none
    "
                      >
                        <div className="rounded-[20px] border border-white/10 bg-zinc-950 px-4 py-3">
                          <p className="text-[13px] text-zinc-200">
                            Movie is not released yet
                          </p>
                        </div>
                      </div>
                    )}
                    <AnimatePresence>
                      {showRatingTooltip && isUpcomingMovie && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 6,
                            scale: 0.97,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            y: 6,
                            scale: 0.97,
                          }}
                          className="
          md:hidden
          absolute
          top-full
          left-0
          mt-3
          z-50
          min-w-[240px]
        "
                        >
                          <div
                            className="fixed inset-0 z-[-1]"
                            onClick={() => setShowRatingTooltip(false)}
                          />

                          <div
                            className="
            rounded-[20px]
            border border-white/10
            bg-gradient-to-br
            from-zinc-950
            via-neutral-900
            to-neutral-950
            backdrop-blur-3xl
            px-4
            py-3
            shadow-[0_10px_40px_rgba(0,0,0,0.5)]
          "
                          >
                            <p className="text-[14px] text-zinc-100 font-semibold">
                              Movie is not released yet
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </IsUserValid>
              )}

              <div className="mt-4 flex items-center justify-center gap-4">
                {watchedLoading ? (
                  <div className="flex-1 h-[56px] rounded-xl border border-white/5 bg-zinc-800/70 overflow-hidden relative">
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
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
                        if (toggleMarkWatchedMutation?.isPending) return;
                        toggleMarkWatchedMutation.mutate();
                      }}
                      className={`relative overflow-hidden flex-1 py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer border transition-all duration-300 active:scale-95 ${isWatched ? "bg-zinc-900 border-zinc-800 text-zinc-400" : "bg-zinc-800 hover:bg-zinc-800/45 border-white/5 text-white"} ${toggleMarkWatchedMutation?.isPending ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {isWatched && (
                        <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden z-20">
                          <span className="absolute top-[10px] -left-[18px] w-[80px] rotate-[-45deg] bg-gradient-to-r from-blue-700 via-blue-500 to-blue-300 text-white text-[8px] font-black text-center py-[3px] uppercase tracking-wider shadow-[0_4px_15px_rgba(59,130,246,0.5)] border-t border-white/40">
                            Watched
                          </span>
                        </div>
                      )}
                      {toggleMarkWatchedMutation?.isPending ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="relative flex items-center justify-center">
                            <div className="absolute w-5 h-5 rounded-full bg-red-500/20 blur-[6px] animate-pulse" />
                            <div className="w-5 h-5 rounded-full border-[2px] border-white/10 border-t-red-500 border-r-red-400 animate-spin" />
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

            {/* Rating Modal */}
            <AnimatePresence>
              {isRatingModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsRatingModalOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-md"
                  />
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative z-[101] bg-zinc-900/90 border border-white/10 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-2xl mt-20 mx-6"
                  >
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/10 blur-[80px] rounded-full" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-20 rounded-xl overflow-hidden border border-white/10 shadow-lg shrink-0">
                            <img
                              src={youtubeThumbnail}
                              alt="Trailer Thumbnail"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = movie.posterPath;
                              }}
                            />
                          </div>
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
                      <div className="text-center mb-5 md:mb-8 min-h-[50px] flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={feedback.text + feedback.emoji}
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
                      <div className="flex flex-wrap justify-center gap-2.5 mb-4 md:mb-8">
                        {[...Array(10)].map((_, index) => {
                          const starValue = index + 1;
                          return (
                            <button
                              key={index}
                              onMouseEnter={() => setHover(starValue)}
                              onMouseLeave={() => setHover(0)}
                              onClick={() => {
                                if (addMovieRatingMutation?.isPending) return;
                                setSelectedRating(starValue);
                              }}
                              className="group relative transition-transform active:scale-3d duration-200 cursor-pointer"
                            >
                              <FaStar
                                className={`transition-all duration-500 ease-out group-hover:rotate-[180deg] group-hover:scale-150 text-[22px] md:text-[25px] ${starValue <= (hover || selectedRating) ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "text-zinc-700"}`}
                              />
                            </button>
                          );
                        })}
                      </div>
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
                            <button
                              disabled={
                                !selectedRating ||
                                addMovieRatingMutation?.isPending
                              }
                              onClick={handleSubmitMovieRating}
                              className={`w-full h-[52px] rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${addMovieRatingMutation?.isPending ? "bg-yellow-500/60 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400 text-black"}`}
                            >
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

            {/* Analytics */}
            <div className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-5 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />
              <div className="flex items-center gap-2 mb-6">
                <IoAnalytics className="text-blue-400 text-[16px] drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
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
                      <span className="block text-2xl text-white tracking-tight">
                        {formatViews(totalViews)}
                      </span>
                      <div className="absolute -bottom-1 -left-5 w-[55px] h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                    </div>
                    <span className="text-[10px] flex items-center gap-1 font-bold text-zinc-500 uppercase mt-3 tracking-widest">
                      <FaEye className="text-blue-400 text-[15px] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />{" "}
                      Views
                    </span>
                  </div>
                  <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <span className="block text-2xl text-white tracking-tight">
                        {formatAvgTime(averageTimeSpent)}
                      </span>
                      <div className="absolute -bottom-1 -left-2 w-[55px] h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
                    </div>
                    <span className="text-[10px] flex gap-1 font-bold text-zinc-500 uppercase mt-3 tracking-widest">
                      <LuTimerReset className="text-blue-400 text-[15px] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />{" "}
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
