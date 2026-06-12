import React, { useEffect, useRef, useState } from "react";
import {
  Star,
  Play,
  Image as ImageIcon,
  Plus,
  TrendingUp,
  Landmark,
  Globe,
  Calendar,
  MapPin,
  Tv,
  Zap,
  Ticket,
  Monitor,
  X,
  Clock,
  ChevronRight,
  ChevronLeft,
  Send,
} from "lucide-react";
import { FaPlay, FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import VideoPlayer from "../Components/VideoPlayer";
import { CiStreamOn } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import ExpandableTooltip from "../Components/ExpandableTooltip";
import IsUserValid from "../ProtectedRoute/IsUserValid";
import { useMovieDetailsAvgRatingData } from "../hooks/useMovieDetailsAnalytics";

const MovieDetailsHeader = ({
  movie,
  // ============================================
  // ✅ RATING PROPS
  // ============================================
  isRatingModalOpen,
  setIsRatingModalOpen,
  userRatingData,
  userRatingLoading,
  addMovieRatingMutation,
  averageRating,
  avgRatingLoading,
}) => {
  console.log("Movie Details Header", movie);

  const getValue = (val) => {
    if (
      val === null ||
      val === undefined ||
      val === "" ||
      val === "0" ||
      val === "N/A"
    ) {
      return "--/--";
    }
    return val;
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showFullTitle, setShowFullTitle] = useState(false);

  // ============================================
  // ✅ RATING LOCAL STATE
  // ============================================
  const [selectedRating, setSelectedRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const boxOfficeData = movie?.boxOffice || {};
  const overAllBoxOffice = boxOfficeData?.overAllBoxOffice;
  const releaseInfo = movie?.releaseInfo || {};
  const screenCount = releaseInfo?.screenCount || "--/--";
  const formats = releaseInfo?.formats || [];
  const distributors = releaseInfo?.distributors || {};
  const tnDistributor = distributors?.tamilNadu?.[0]?.name || "--/--";
  const formatText = formats.length > 0 ? formats.join(", ") : "--/--";
  const totalScreens = getValue(screenCount?.worldwideTotal);
  const availableOn = movie?.availableOn || [];

  const streamInfo = movie?.streamReleaseInfo || {};
  const languages = movie?.language || [];

  const streamDate = getValue(movie?.ottReleaseDate);
  const quality =
    streamInfo?.quality && streamInfo.quality.length > 0
      ? streamInfo.quality.join(", ")
      : "--/--";
  const languageText = languages.length > 0 ? languages.join(", ") : "--/--";

  const displayBoxOffice =
    overAllBoxOffice && overAllBoxOffice !== "0"
      ? overAllBoxOffice
      : boxOfficeData?.totalWorldwide && boxOfficeData?.totalWorldwide !== "0"
        ? boxOfficeData.totalWorldwide
        : "--/--";

  const isTheaterAvailable =
    movie?.theatreReleaseDate && movie.theatreReleaseDate !== "TBA";
  const isOTTAvailable =
    movie?.ottReleaseDate && movie.ottReleaseDate !== "TBA";
  const ottArray =
    availableOn?.map((item) => {
      if (typeof item === "object" && item !== null) {
        return item.name || "";
      }

      return item;
    }) || [];
  const languageArray = languages.length > 0 ? languages : [];
  const isBoxOfficeAvailable = !!overAllBoxOffice;
  // const { averageRating, isLoading: avgRatingLoading } =
  //   useMovieDetailsAvgRatingData(movie?.id);

  // ============================================
  // ✅ DERIVED RATING STATE
  // ============================================
  const alreadyRated = userRatingData?.rated;

  const parseData = (data) => {
    try {
      let result = data;
      while (typeof result === "string") {
        result = JSON.parse(result);
      }
      return Array.isArray(result) ? result : [];
    } catch (error) {
      if (typeof data === "string" && data.trim() !== "") {
        return [data];
      }
      return [];
    }
  };

  // ============================================
  // ✅ SCROLL LOCK (rating modal)
  // ============================================
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

  useEffect(() => {
    if (isGalleryOpen || activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isGalleryOpen, activeModal]);

  // ============================================
  // ✅ RATING FEEDBACK
  // ============================================
  const getRatingFeedback = (val) => {
    if (val >= 9) return { emoji: "🔥", text: "Masterpiece! Must watch!" };
    if (val >= 7) return { emoji: "😎", text: "Excellent choice!" };
    if (val >= 5) return { emoji: "👍", text: "Good, worth a watch." };
    if (val >= 3) return { emoji: "😐", text: "It's just okay." };
    if (val > 0) return { emoji: "🥱", text: "Not my cup of tea." };
    return { emoji: "⭐", text: "How would you describe your experience?" };
  };

  const feedback = getRatingFeedback(hover || selectedRating);
  const isActive = selectedRating > 0 || hover > 0;

  // ============================================
  // ✅ SUBMIT RATING HANDLER
  // ============================================
  const handleSubmitMovieRating = () => {
    if (addMovieRatingMutation?.isPending) return;
    if (!selectedRating) return;

    addMovieRatingMutation.mutate(
      {
        movieId: movie?.id,
        rating: selectedRating,
        review: reviewText,
      },
      {
        onSuccess: () => {
          setIsRatingModalOpen(false);
          setSelectedRating(0);
          setReviewText("");
        },
      },
    );
  };

  // ============================================
  // ✅ YOUTUBE HELPERS
  // ============================================
  const getYouTubeID = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url?.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeID(movie.trailerUrl);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  // For modal poster thumbnail (same logic as MovieDescriptionSection)
  const youtubeThumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : movie.posterPath;

  const galleryArray = parseData(movie?.galleryLinks) || [];
  const genres = parseData(movie?.genres);

  const getDisplayThumbnail = () => {
    if (galleryArray.length > 0) {
      const firstVideoId = getYouTubeID(galleryArray[0]);
      return `https://img.youtube.com/vi/${firstVideoId}/maxresdefault.jpg`;
    }
    const trailerVideoId = getYouTubeID(movie.trailerUrl);
    return `https://img.youtube.com/vi/${trailerVideoId}/maxresdefault.jpg`;
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    if (currentIndex < galleryArray.length - 1)
      setCurrentIndex((prev) => prev + 1);
  };
  const prevImage = (e) => {
    e?.stopPropagation();
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleDoubleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    if (x > width / 2) {
      nextImage();
    } else {
      prevImage();
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const ChipList = ({ items }) => {
    const containerRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const checkOverflow = () => {
        setIsOverflowing(el.scrollWidth > el.clientWidth);
      };
      checkOverflow();
      const resizeObserver = new ResizeObserver(checkOverflow);
      resizeObserver.observe(el);
      return () => resizeObserver.disconnect();
    }, [items]);

    return (
      <div>
        <div
          ref={containerRef}
          className={`flex gap-2 overflow-hidden transition-all duration-300 ${
            expanded ? "flex-wrap" : "whitespace-nowrap"
          }`}
        >
          {items.map((item, idx) => (
            <span
              key={idx}
              className="px-2 py-[2px] text-[9px] bg-purple-500/20 text-purple-300 rounded-full border border-purple-400/20 shrink-0"
            >
              {item}
            </span>
          ))}
        </div>
        {isOverflowing && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-purple-400 mt-1 hover:underline"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    );
  };

  const modalContent = {
    boxOffice: {
      title: "FINANCIAL STATS",
      subtitle: "Global Collection Report",
      accent: "green",
      stats: [
        {
          label: "Budget",
          value: getValue(boxOfficeData?.budget),
          icon: <Landmark size={14} />,
        },
        {
          label: "Worldwide",
          value: getValue(boxOfficeData?.totalWorldwide),
          icon: <Globe size={14} />,
          color: "text-green-400",
        },
        { label: "Domestic", value: getValue(boxOfficeData?.domestic) },
        {
          label: "International",
          value: getValue(boxOfficeData?.international),
        },
      ],
      footerLabel: "Final Verdict",
      footerValue: getValue(boxOfficeData?.verdict),
    },
    theater: {
      title: "THEATRICAL INFO",
      subtitle: "Cinema Release Details",
      accent: "blue",
      stats: [
        {
          label: "Release Date",
          value: getValue(movie.theatreReleaseDate),
          icon: <Calendar size={14} />,
        },
        {
          label: "Screens",
          value: totalScreens,
          icon: <MapPin size={14} />,
        },
        { label: "Format", value: formatText },
        { label: "Distributor", value: tnDistributor },
      ],
      footerLabel: "Status",
      footerValue: movie.theatreReleaseDate ? "Released" : "Not Announced",
    },
    ott: {
      title: "STREAMING INFO",
      subtitle: "Digital Premiere Details",
      accent: "purple",
      stats: [
        {
          label: "OTT Platform",
          value: <ChipList items={ottArray} />,
          type: "chips",
          icon: <Tv size={14} />,
        },
        {
          label: "Stream Date",
          value: streamDate,
          icon: <Calendar size={14} />,
        },
        {
          label: "Quality",
          value: quality,
          icon: <Zap size={14} />,
        },
        {
          label: "Languages",
          value: <ChipList items={languageArray} />,
          type: "chips",
        },
      ],
      footerLabel: "Availability",
      footerValue:
        streamDate !== "--/--" && streamDate !== "TBA"
          ? "Streaming Available"
          : "Coming Soon",
    },
  };

  const currentData = modalContent[activeModal];

  const getReleaseYear = () => {
    const theatreDate = movie?.theatreReleaseDate;
    const ottDate = movie?.ottReleaseDate;
    const extractYear = (dateStr) => {
      if (!dateStr || dateStr === "TBA") return null;
      const date = new Date(dateStr);
      return isNaN(date) ? null : date.getFullYear();
    };
    return extractYear(theatreDate) || extractYear(ottDate) || "TBA";
  };

  const InfoStat = ({ label, value, icon, onClick, underlineColor }) => {
    const isActive = !!onClick;
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center justify-center min-w-[95px] cursor-pointer group ${
          isActive ? "cursor-pointer group" : "opacity-50 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            {icon && (
              <span
                className={`transition ${
                  isActive ? "group-hover:scale-110 opacity-80" : "opacity-50"
                }`}
              >
                {icon}
              </span>
            )}
            <span className="text-[15px] font-semibold text-white tracking-tight">
              {value}
            </span>
          </div>
          <div
            className={`mt-1 h-[2px] w-[40px] rounded-full opacity-50 transition-all duration-300 ${isActive ? "group-hover:opacity-100 opacity-20" : ""}`}
            style={{
              background: `linear-gradient(to right, transparent, ${underlineColor}, transparent)`,
            }}
          />
        </div>
        <span
          className={`text-[9px] font-bold uppercase mt-3 tracking-[2px] transition ${
            isActive
              ? "text-zinc-400 group-hover:text-zinc-300"
              : "text-zinc-500"
          }`}
        >
          {label}
        </span>
      </div>
    );
  };

  const StatBox = ({ label, value, color = "text-white", icon, type }) => (
    <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
      <div className="flex items-center gap-1.5 mb-1">
        {icon && <span className="text-zinc-400">{icon}</span>}
        <span className="text-zinc-200 text-[12px] uppercase tracking-wider">
          {label}
        </span>
      </div>
      {type === "chips" ? (
        value
      ) : (
        <p className="text-[13px] pt-1 text-white">
          {/* Object-a handle panna check */}
          {typeof value === "object" && value !== null
            ? JSON.stringify(value)
            : value}
        </p>
      )}
    </div>
  );

  const MobileInfoCard = ({ label, value, icon, underlineColor, onClick }) => {
    const isActive = !!onClick;
    return (
      <div
        onClick={onClick}
        className={`w-full rounded-xl px-4 pb-2 bg-gradient-to-b from-zinc-900/80 to-black/80 border border-white/5 ${
          isActive ? "active:scale-[0.98]" : "opacity-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 uppercase tracking-widest">
              {label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {icon && <span className="opacity-80">{icon}</span>}
            <span className="text-[14px] font-semibold text-white">
              {value}
            </span>
          </div>
        </div>
        <div
          className="mt-1 h-[2px] w-[50px] rounded-full"
          style={{
            background: `linear-gradient(to right, transparent, ${underlineColor}, transparent)`,
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-[#121212] text-white font-sans">
      {/* 1. Title & Ratings Section */}
      <div className="pt-6 pb-3 md:pt-8 md:pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5">
        {/* Left Side: Title & Info */}
        <div className="flex flex-col md:flex-col lg:flex-1 space-y-2 md:space-y-3 lg:space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* ✅ TITLE — wider + mobile tooltip */}
            <div className="relative group/title max-w-[320px] md:max-w-[420px]">
              <h1
                onClick={() => setShowFullTitle((prev) => !prev)}
                className="text-4xl text-white tracking-[1px] drop-shadow-2xl transition-all duration-300 truncate cursor-pointer md:cursor-default"
              >
                {movie.title}
              </h1>

              {/* ✅ DESKTOP — hover tooltip */}
              <div className="hidden md:block absolute left-0 top-full mt-4 opacity-0 invisible group-hover/title:opacity-100 group-hover/title:visible translate-y-2 group-hover/title:translate-y-0 transition-all duration-300 z-50 pointer-events-none min-w-[280px] max-w-[520px]">
                <div className="relative overflow-hidden rounded-[24px] border border-white/[0.10] bg-gradient-to-br from-zinc-950 via-neutral-900 to-neutral-950 backdrop-blur-3xl px-5 py-4 shadow-[0_10px_45px_rgba(0,0,0,0.45)]">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-500/10 blur-[65px] rounded-full" />
                  <p className="relative z-10 text-[15px] leading-7 tracking-[0.01em] font-semibold text-zinc-100">
                    {movie.title}
                  </p>
                </div>
              </div>

              {/* ✅ MOBILE — click tooltip (AnimatePresence) */}
              <AnimatePresence>
                {showFullTitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="md:hidden absolute left-0 top-full mt-3 z-50 min-w-[240px] max-w-[300px]"
                  >
                    {/* outside click-ல close */}
                    <div
                      className="fixed inset-0 z-[-1]"
                      onClick={() => setShowFullTitle(false)}
                    />
                    <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-zinc-950 via-neutral-900 to-neutral-950 backdrop-blur-3xl px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                      <div className="absolute -top-8 -right-8 w-20 h-20 bg-orange-500/10 blur-[50px] rounded-full" />
                      <p className="relative z-10 text-[14px] leading-6 font-semibold text-zinc-100">
                        {movie.title}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-br from-zinc-800 to-black border border-zinc-700/50 rounded-md font-bold text-[13px] text-zinc-200 tracking-widest uppercase shadow-[0_10px_20px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.4)] ring-1 ring-white/10 ring-inset">
                {getReleaseYear()}
              </span>
              <span className="px-3 py-1 bg-gradient-to-br from-zinc-800 to-black border border-zinc-700/50 rounded-md font-bold text-[12px] text-zinc-200 tracking-widest uppercase shadow-[0_10px_20px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.4)] ring-1 ring-white/10 ring-inset">
                {movie.certification || "TBA"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* RUNTIME — Genres exact UI copy */}
            <div className="flex items-center gap-3 px-4 py-2 bg-zinc-800/40 backdrop-blur-md rounded-xl border border-white/5">
              <Clock size={14} className="text-zinc-500 shrink-0" />
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest border-r border-white/10 pr-3">
                Runtime
              </span>
              <div className="flex flex-wrap gap-1">
                <span className="px-3 py-1 border border-gray-700 text-gray-300/65 rounded-md text-[13px] md:text-[14px] hover:bg-gray-800/50 transition-colors">
                  {movie.durationOrSeason || "TBA"}
                </span>
              </div>
            </div>

            {/* GENRES — unchanged */}
            <div className="flex items-center gap-3 px-4 py-2 bg-zinc-800/40 backdrop-blur-md rounded-xl border border-white/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-500 shrink-0"
              >
                <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" />
                <path d="m6.2 5.3 3.1 3.9" />
                <path d="m12.4 3.4 3.1 3.9" />
                <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
              </svg>
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest border-r border-white/10 pr-3">
                Genres
              </span>
              <div className="flex flex-wrap gap-1">
                {genres.map((genre, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="px-3 py-1 border border-gray-700 text-gray-300/65 rounded-md text-[13px] md:text-[14px] hover:bg-gray-800/50 transition-colors">
                      {genre}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Stats + Rate Button (Desktop) */}
        <div className="md:flex hidden flex-wrap items-center gap-6">
          {/* <InfoStat
            label="Rating"
            value={`${movie.imdbRating}/10`}
            icon={
              <Star className="text-yellow-500 fill-yellow-500" size={14} />
            }
            underlineColor="#eab308"
          /> */}
          {/* ============================================ */}
          {/* ✅ RATE WIDGET + AVG RATING — Desktop Header  */}
          {/* ============================================ */}
          <IsUserValid>
            <div
              onClick={() => {
                if (
                  addMovieRatingMutation?.isPending ||
                  userRatingLoading ||
                  alreadyRated
                )
                  return;
                setIsRatingModalOpen(true);
              }}
              className="flex flex-col items-center justify-center min-w-[105px] group cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  {userRatingLoading || addMovieRatingMutation?.isPending ? (
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-5 h-5 rounded-full bg-yellow-500/20 blur-[4px] animate-pulse" />
                      <div className="w-5 h-5 rounded-full border-[2px] border-white/10 border-t-yellow-500 border-r-yellow-400 animate-spin" />
                    </div>
                  ) : (
                    <>
                      {alreadyRated ? (
                        <FaStar
                          size={17}
                          className="text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] transition-all duration-300"
                        />
                      ) : (
                        <FaRegStar
                          size={17}
                          className="text-yellow-400 group-hover:text-yellow-300 transition-all duration-300 group-hover:scale-110"
                        />
                      )}
                      <span
                        className={`text-[13px] font-semibold uppercase tracking-widest transition-colors duration-300 ${
                          alreadyRated
                            ? "text-yellow-400"
                            : "text-white group-hover:text-yellow-400"
                        }`}
                      >
                        {alreadyRated ? "Rated" : "Rate"}
                      </span>
                    </>
                  )}
                </div>

                {/* UNDERLINE */}
                <div
                  className="mt-1.5 h-[2px] w-[44px] rounded-full transition-all duration-300 opacity-20 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(to right, transparent, #eab308, transparent)`,
                  }}
                />
              </div>

              {/* AVERAGE RATING */}
              <span className="text-[13px] font-bold uppercase mt-1 tracking-[2px] text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
                {avgRatingLoading ? (
                  <span className="inline-block w-10 h-2.5 rounded-full bg-white/10 animate-pulse align-middle" />
                ) : (
                  <span className="flex items-center">
                    {/* <FaStar size={10} className="text-yellow-500" /> */}
                    {averageRating}/10
                  </span>
                )}
              </span>
            </div>
          </IsUserValid>

          <InfoStat
            label="Box Office"
            value={displayBoxOffice}
            onClick={
              isBoxOfficeAvailable ? () => setActiveModal("boxOffice") : null
            }
            underlineColor="#22c55e"
          />

          <InfoStat
            label="Theater"
            value={movie.theatreReleaseDate || "TBA"}
            onClick={
              isTheaterAvailable ? () => setActiveModal("theater") : null
            }
            underlineColor="#3b82f6"
          />

          <InfoStat
            label="OTT"
            value={movie.ottReleaseDate || "TBA"}
            onClick={isOTTAvailable ? () => setActiveModal("ott") : null}
            underlineColor="#a855f7"
          />
        </div>
      </div>

      {/* ============================================ */}
      {/* ✅ RATING MODAL — AnimatePresence (exact copy from MovieDescriptionSection) */}
      {/* ============================================ */}
      <AnimatePresence>
        {isRatingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRatingModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-[101] bg-zinc-900/90 border border-white/10 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-2xl mt-20 mx-6"
            >
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/10 blur-[80px] rounded-full" />

              <div className="relative z-10">
                {/* Header */}
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

                {/* Dynamic Feedback Text */}
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
                              {hover || selectedRating}/10
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

                {/* 10 Stars */}
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

                {/* Review Textarea + Submit */}
                <AnimatePresence>
                  {selectedRating > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <textarea
                        disabled={addMovieRatingMutation?.isPending}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your experience..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-colors resize-none h-24"
                      />
                      <button
                        disabled={
                          !selectedRating || addMovieRatingMutation?.isPending
                        }
                        onClick={handleSubmitMovieRating}
                        className={`
                          w-full h-[52px] rounded-2xl font-semibold
                          transition-all duration-300
                          flex items-center justify-center gap-2
                          ${
                            addMovieRatingMutation?.isPending
                              ? "bg-yellow-500/60 cursor-not-allowed"
                              : "bg-yellow-500 hover:bg-yellow-400 text-black"
                          }
                        `}
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

      {/* Dynamic Info Modals (Box Office / Theater / OTT) */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/10 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-zinc-900 border border-white/10 w-full max-w-md p-6 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div
                className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-20 
                  ${
                    currentData.accent === "green"
                      ? "bg-green-500"
                      : currentData.accent === "blue"
                        ? "bg-blue-500"
                        : "bg-purple-500"
                  }`}
              />
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-semibold tracking-wider text-white">
                    {currentData.title}
                  </h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                    {currentData.subtitle}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {currentData.stats.map((stat, idx) => (
                  <StatBox key={idx} {...stat} />
                ))}
              </div>
              <div className="mt-6 p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
                <span className="text-zinc-400 text-xs font-bold uppercase">
                  {currentData.footerLabel}
                </span>
                <span
                  className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                    ${
                      currentData.accent === "green"
                        ? "bg-green-500/20 text-green-400 border-green-500/20"
                        : currentData.accent === "blue"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/20"
                          : "bg-purple-500/20 text-purple-400 border-purple-500/20"
                    }`}
                >
                  {currentData.footerValue}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Visuals Section */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-2 md:h-[450px]">
        <div className="order-1 lg:order-none md:col-span-3 grid grid-cols-12 gap-2 h-[150px] md:h-full">
          <div
            onClick={() => galleryArray.length > 0 && setIsGalleryOpen(true)}
            className="col-span-4 md:col-span-12 relative mb-1 md:mb-0 group overflow-hidden rounded-lg cursor-pointer"
          >
            <img
              src={getDisplayThumbnail()}
              alt="Gallery Preview"
              className="w-full h-full object-cover saturate-125 border-r border-white/10 group-hover:scale-105 transition-transform duration-500"
            />

            {/* ✅ BOTTOM-RIGHT AWARD TAG — count badge */}
            {galleryArray.length > 1 && (
              <div className="absolute  right-0 top-0 flex items-center">
                {/* TAG SHAPE — left pointy notch */}
                <div
                  className="
          relative flex items-center gap-1
          bg-black/80 backdrop-blur-sm
          pl-3 pr-3 py-1
          rounded-l-full
          border border-white/10
          shadow-[0_2px_12px_rgba(0,0,0,0.5)]
        "
                  style={{
                    clipPath:
                      "polygon(12px 0%, 100% 0%, 100% 100%, 12px 100%, 0% 50%)",
                    paddingLeft: "18px",
                  }}
                >
                  <Plus size={15} className="text-zinc-300" />
                  <span className="text-[15px] font-bold text-white tracking-wide">
                    {galleryArray.length}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-8 md:hidden flex flex-col">
            <IsUserValid>
              <div
                onClick={() => {
                  if (
                    addMovieRatingMutation?.isPending ||
                    userRatingLoading ||
                    alreadyRated
                  )
                    return;
                  setIsRatingModalOpen(true);
                }}
                className="w-full rounded-xl px-4 pb-2 bg-gradient-to-b from-zinc-900/80 to-black/80 border border-white/5 active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[13px] font-semibold uppercase tracking-widest transition-colors duration-300 ${
                      alreadyRated
                        ? "text-yellow-400"
                        : "text-white group-hover:text-yellow-400"
                    }`}
                  >
                    {alreadyRated ? "Rated" : "Rate"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {userRatingLoading || addMovieRatingMutation?.isPending ? (
                      <div className="w-4 h-4 rounded-full border-[2px] border-white/10 border-t-yellow-500 animate-spin" />
                    ) : alreadyRated ? (
                      <FaStar size={13} className="text-yellow-400" />
                    ) : (
                      <FaRegStar size={13} className="text-yellow-400" />
                    )}
                    <span className="text-[14px] font-semibold text-white">
                      {avgRatingLoading ? (
                        <span className="inline-block w-8 h-2 rounded-full bg-white/10 animate-pulse align-middle" />
                      ) : (
                        `${averageRating}/10`
                      )}
                    </span>
                  </div>
                </div>
                <div
                  className="mt-1 h-[2px] w-[50px] rounded-full"
                  style={{
                    background: `linear-gradient(to right, transparent, #eab308, transparent)`,
                  }}
                />
              </div>
            </IsUserValid>
            <MobileInfoCard
              label="Box Office"
              value={displayBoxOffice}
              underlineColor="#22c55e"
              onClick={
                isBoxOfficeAvailable ? () => setActiveModal("boxOffice") : null
              }
            />
            <MobileInfoCard
              label="Theater"
              value={movie.theatreReleaseDate || "TBA"}
              underlineColor="#3b82f6"
              onClick={
                isTheaterAvailable ? () => setActiveModal("theater") : null
              }
            />
            <MobileInfoCard
              label="OTT"
              value={movie.ottReleaseDate || "TBA"}
              underlineColor="#a855f7"
              onClick={isOTTAvailable ? () => setActiveModal("ott") : null}
            />
          </div>
        </div>

        {/* Video Player */}
        <div className="order-1 md:col-span-9 md:mr-3 md:order-2 lg:order-none relative rounded-lg group overflow-hidden aspect-video md:aspect-auto">
          {isPlaying ? (
            <div className="w-full h-full">
              <VideoPlayer
                videoOptions={{
                  autoplay: true,
                  controls: true,
                  responsive: true,
                  fluid: true,
                  techOrder: ["youtube"],
                  sources: [{ src: movie.trailerUrl, type: "video/youtube" }],
                }}
                onVideoEnd={() => setIsPlaying(false)}
              />
            </div>
          ) : (
            <div
              className="w-full h-full relative cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              <img
                src={thumbnail}
                alt="Thumbnail"
                className="w-full h-full object-cover opacity-60 grayscale-[0.3] brightness-50 group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-black/50 border border-white/20 p-4 md:p-5 rounded-full backdrop-blur-sm">
                    <FaPlay size={24} className="text-white ml-1" />
                  </div>
                  <span className="text-white font-bold tracking-widest uppercase text-[10px] md:text-sm shadow-lg">
                    Play Trailer
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gallery Modal */}
        <AnimatePresence>
          {isGalleryOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] bg-black/95 pt-0 md:pt-20 flex items-center justify-center p-4"
              onClick={() => setIsGalleryOpen(false)}
            >
              <button className="absolute top-20 right-[45%] md:hidden text-white/70 hover:text-white transition-colors">
                <X size={32} />
              </button>
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative max-w-5xl w-full aspect-video flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute -bottom-[50px] md:-bottom-[30px] lg:bottom-[20px] left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/10 border border-white/20 backdrop-blur-xl rounded-full shadow-2xl">
                  <span className="text-xs font-bold tracking-[0.2em] text-white/90">
                    {currentIndex + 1}{" "}
                    <span className="text-white/30 mx-1">|</span>{" "}
                    {galleryArray.length}
                  </span>
                </div>

                {currentIndex > 0 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-[-20px] hidden md:hidden lg:block md:left-[-60px] p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                  >
                    <ChevronLeft size={40} />
                  </button>
                )}

                <div>
                  <motion.img
                    key={currentIndex}
                    src={`https://img.youtube.com/vi/${getYouTubeID(galleryArray[currentIndex])}/maxresdefault.jpg`}
                    alt="Gallery"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = Math.abs(offset.x) * velocity.x;
                      if (
                        swipe < -1000 &&
                        currentIndex < galleryArray.length - 1
                      ) {
                        setCurrentIndex((prev) => prev + 1);
                      } else if (swipe > 1000 && currentIndex > 0) {
                        setCurrentIndex((prev) => prev - 1);
                      }
                    }}
                    onDoubleClick={handleDoubleClick}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-full h-auto max-h-[75vh] object-contain select-none cursor-grab active:cursor-grabbing"
                  />
                </div>

                {currentIndex < galleryArray.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-[-20px] md:right-[-60px] p-2 hidden md:hidden lg:block bg-white/10 hover:bg-white/20 rounded-full transition-all"
                  >
                    <ChevronRight size={40} />
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MovieDetailsHeader;
