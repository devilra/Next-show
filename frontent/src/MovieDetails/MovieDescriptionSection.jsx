import React, { useEffect, useState } from "react";
import { Plus, Eye, Edit2, Users, Music, Star, X, Send } from "lucide-react";
import { CiShare2 } from "react-icons/ci";
import { OTT_PLATFORMS } from "../ADMIN/Dashboard/CentralizedContent/CentralizedCreateMovie/OttplatFormData";
import { LuClapperboard } from "react-icons/lu";
import { FaPlay, FaStar } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import { LuCopy } from "react-icons/lu";
import { IoNotificationsOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

const MovieDescriptionSection = ({
  movie,
  isRatingModalOpen,
  setIsRatingModalOpen,
}) => {
  // console.log(movie);

  // const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

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

  return (
    <div className="py-6 bg-[#121212] space-y-4 mb-8 text-white">
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
                <button className="group relative md:py-4 flex items-center justify-center cursor-pointer gap-2 px-4 py-2 md:px-10 rounded-lg md:rounded-xl text-white text-[10px] md:text-[13px] bg-blue-600 transition-all duration-300 hover:shadow-[0_0_10px_10px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-95">
                  <span className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <IoNotificationsOutline className="relative z-10 text-[12px] md:text-[18px] group-hover:animate-bounce" />
                  <span className="relative z-10 tracking-widest">
                    REMIND ME
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => window.open(movie.watchUrl, "_blank")}
                  className="group relative flex items-center cursor-pointer justify-center gap-1 px-4 py-2 md:px-10 rounded-lg md:rounded-xl text-white text-[10px] md:text-[13px] bg-orange-500 transition-all duration-300 hover:shadow-[0_0_10px_5px_rgba(249,115,22,0.4)] hover:scale-[1.02] active:scale-95"
                >
                  <span className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <FaPlay className="relative z-10 text-[10px] md:text-[15px]" />
                  <span className="relative z-10 ">WATCH NOW</span>
                </button>
              )}

              {/* WATCHLIST */}
              <button className="group cursor-pointer relative flex items-center justify-center gap-2 px-4 py-2.5 md:py-4 md:px-10 rounded-lg md:rounded-xl text-white text-[10px] md:text-[13px] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black/40 border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-[0_0_30px_5px_rgba(255,255,255,0.15)] hover:border-white/30 hover:-translate-y-0.5 active:scale-95">
                <span className="absolute inset-0 rounded-lg md:rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <IoMdHeartEmpty className="relative z-10 text-[15px] md:text-[20px] text-zinc-400 group-hover:text-red-500 transition-all duration-300 group-hover:scale-110" />
                <span className="relative z-10 tracking-widest transition-colors duration-300 group-hover:text-white">
                  WATCHLIST
                </span>
              </button>

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
                  className="w-3 h-3 md:w-4 md:h-4 text-zinc-400 group-hover:text-white transition-colors"
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
                    <span className="text-[7px] md:text-[11px] tracking-[0.13em] font-medium uppercase text-zinc-300 group-hover:text-white transition-colors">
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
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-10">
        {/* Left Side: Description & Info Card */}
        <div className="flex-1 order-1 space-y-8">
          {/* ✨ Description Section with unique accent */}
          <div className="relative group">
            <div className="absolute left-1 top-0 w-1 md:w-1.5 h-full bg-gradient-to-b from-orange-500 to-yellow-500 rounded-tr-2xl rounded-br-2xl shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
            <p className="text-[13px] md:text-[15px] lg:text-[17px]  leading-relaxed text-gray-200  pl-6 transition-colors group-hover:text-white">
              {movie.longDescription}
            </p>
          </div>

          {/* 📋 Modern Credits Card */}
          <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-md rounded-[2rem] p-2 shadow-2xl overflow-hidden relative">
            {/* Background glow effect */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-500/5 blur-[80px] rounded-full" />

            <div className="divide-y divide-white/5">
              {/* Director Row */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-white/5 hover:bg-white/[0.02] transition-all px-4 rounded-2xl">
                <div className="flex items-center gap-4 sm:w-40 shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-orange-500 group-hover:text-black transition-all duration-500">
                    <LuClapperboard size={16} />
                  </div>
                  <span className="font-bold text-zinc-400 text-[13px] md:text-[15px]  tracking-[1px]">
                    Director
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-blue-400  text-[13px] md:text-[14px] cursor-pointer hover:text-blue-300 transition-colors   sm:text-[16px] ml-11 sm:ml-0">
                    {movie.director}
                  </span>
                </div>
              </div>

              {/* Writer Row */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-white/5 hover:bg-white/[0.02] transition-all px-4 rounded-2xl">
                <div className="flex items-center gap-4 sm:w-40 shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-orange-500 group-hover:text-black transition-all duration-500">
                    <Edit2 size={16} />
                  </div>
                  <span className="font-bold text-zinc-400 text-[13px] md:text-[14px]  tracking-[1px]">
                    Writer
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-blue-400  text-[13px] md:text-[14px] cursor-pointer hover:text-blue-300 transition-colors   sm:text-[16px] ml-11 sm:ml-0">
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
                  <span className="font-bold text-zinc-400 text-[13px] md:text-[15px]  tracking-[1px]">
                    Casts
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-white/5 hover:bg-white/[0.02] transition-all  rounded-2xl">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 ml-11 md:ml-0">
                    {movie.cast ? (
                      movie.cast.split(",").map((star, index, array) => (
                        <React.Fragment key={index}>
                          <span className="text-blue-400 cursor-pointer text-[13px] md:text-[14px]  transition-all">
                            {star.trim()}
                          </span>
                          {index < array.length - 1 && (
                            <span className="w-1 h-1 rounded-full bg-zinc-200 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                          )}
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
                  <span className="font-bold text-zinc-400 text-[13px] md:text-[15px]  tracking-[1px]">
                    Music
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-blue-400  text-[13px] md:text-[14px] cursor-pointer hover:text-blue-300 transition-colors   sm:text-[16px] ml-11 sm:ml-0">
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
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-neutral-950  py-4  rounded-2xl flex items-center justify-center gap-[7px] transition-all active:scale-95 shadow-lg shadow-yellow-500/20"
              >
                <Star size={20} fill="currentColor" className="shrink-0" />
                <span className="text-[14px] text-black/90 font-bold  uppercase">
                  Rate Now
                </span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-4">
                <button className="flex-1 bg-zinc-800 active:scale-95 hover:bg-zinc-800/45 text-white py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer border transition-all border-white/5">
                  <Eye size={18} className="text-blue-400" />
                  <span className="text-xs font-bold uppercase">
                    Mark Watched
                  </span>
                </button>
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
                              onClick={() => setRating(starValue)}
                              className="group relative transition-transform active:scale-3d duration-200 cursor-pointer "
                            >
                              <FaStar
                                className={`transition-all duration-500 ease-out group-hover:rotate-[180deg] group-hover:scale-150 text-[22px] md:text-[25px]
                                  ${
                                    starValue <= (hover || rating)
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
                        {rating > 0 && (
                          <motion.div>
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Write your experience..."
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-colors resize-none h-24"
                            />

                            <button
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
              {/* Subtle Background Glow */}
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-700" />

              <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[2px] mb-6 flex items-center gap-2">
                {/* <div className="w-1 h-3 bg-blue-500 rounded-full" /> */}
                Community Impact
              </h4>

              <div className="flex items-center justify-around relative z-10">
                {/* Saves Section */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <span className="block text-2xl  text-white tracking-tight">
                      12K+
                    </span>
                    <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase mt-3 tracking-widest">
                    Saves
                  </span>
                </div>

                {/* Stylish Divider */}
                <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />

                {/* Rating Section */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <span className="block text-2xl  text-white tracking-tight">
                      85%
                    </span>
                    <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase mt-3 tracking-widest">
                    Rating
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDescriptionSection;
