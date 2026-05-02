import React, { useState, useEffect, useRef } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiVolumeOff,
  HiVolumeUp,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { FaAngleRight, FaPlay, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Slick CSS imports
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function VideoDetailScreen({ activeVideos, activeBlogs = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWatchingFull, setIsWatchingFull] = useState(false);
  const [isBgMuted, setIsBgMuted] = useState(true); // Background video mute state
  const bgIframeRef = useRef(null); // Background loop iframe ref
  const fullIframeRef = useRef(null); // Full screen player iframe ref
  const [direction, setDirection] = useState(0); // 2. Direction track panna state

  // ✅ Extract and Merge Upcoming Trailers logic
  const upcomingTrailers = [
    ...(activeVideos?.theatrical?.upcoming || []),
    ...(activeVideos?.streaming?.upcoming || []),
  ];

  // console.log("Video Details trailer", upcomingTrailers);

  const currentVideo = upcomingTrailers[currentIndex];

  const YT_ORIGIN = "https://www.youtube.com";

  // 1. Duration Logic (Empty-ah iruntha "TBA" + Dim style)
  const renderDuration = () => {
    const duration = currentVideo?.durationOrSeason;
    if (!duration || duration.trim() === "") {
      return <span className="text-white/40 italic">TBA</span>;
    }
    return <span>{duration}</span>;
  };

  // 2. Release Date Logic ("TBA" vantha "Coming Soon" + Dim style)
  const renderReleaseStatus = () => {
    const rDate =
      currentVideo?.theatreReleaseDate || currentVideo?.ottReleaseDate || "TBA";
    if (rDate === "TBA") {
      return (
        <span className="text-white/40 italic tracking-wider">coming soon</span>
      );
    }
    try {
      const year = new Date(rDate).getFullYear();
      return <span>{isNaN(year) ? "COMING SOON" : year}</span>;
    } catch (error) {
      return <span className="text-white/40 italic">coming soon</span>;
    }
  };

  // ✅ Function to send command to background loop iframe
  const sendBgCommand = (func) => {
    try {
      if (bgIframeRef.current?.contentWindow) {
        bgIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func, args: [] }),
          YT_ORIGIN,
        );
      }
    } catch (err) {
      console.warn("YT bg error:", err);
    }
  };

  // ✅ Function to send command to full player iframe
  const sendFullCommand = (func) => {
    try {
      if (fullIframeRef.current?.contentWindow) {
        fullIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func, args: [] }),
          YT_ORIGIN,
        );
      }
    } catch (err) {
      console.warn("YT full error:", err);
    }
  };

  // console.log("Current Video", upcomingTrailers);

  // ✅ Sync background volume state to the background iframe
  // useEffect(() => {
  //   if (!isWatchingFull) {
  //     const timer = setTimeout(() => {
  //       sendBgCommand(isBgMuted ? "mute" : "unMute");
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  //   return undefined;
  // }, [isBgMuted, currentIndex, isWatchingFull]);

  // ✅ Full video player
  const getFullVideoUrl = (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) return "";

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&enablejsapi=1&playsinline=1`;
  };

  // ✅ Extract YouTube ID
  const extractVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
    );
    return match && match[2].length === 11 ? match[2] : null;
  };

  // ✅ Background embed
  const getEmbedUrl = (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) return "";

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1&enablejsapi=1&playsinline=1&iv_load_policy=3`;
  };

  const handleWatchNow = () => setIsWatchingFull(true);
  const handleExitFullVideo = () => setIsWatchingFull(false);

  // ✅ Toggle background mute state
  const toggleVolume = () => {
    setIsBgMuted((prev) => {
      const next = !prev;
      if (!isWatchingFull) {
        sendBgCommand(next ? "mute" : "unMute");
      }
      return next;
    });
  };

  // 3. Slide variants logic
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const paginate = (dir) => {
    setDirection(dir);

    setCurrentIndex((prev) => {
      if (dir === 1 && prev < upcomingTrailers.length - 1) {
        return prev + 1;
      } else if (dir === -1 && prev > 0) {
        return prev - 1;
      }
      return prev; // boundary stop
    });
  };

  const handleBgIframeLoad = () => {
    setTimeout(() => {
      sendBgCommand(isBgMuted ? "mute" : "unMute");
    }, 800); // delay added
  };

  const handleFullIframeLoad = () => {
    if (fullIframeRef.current && fullIframeRef.current.contentWindow) {
      sendFullCommand("unMute");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen md:h-[450px] bg-[#0a0d14] text-white overflow-hidden mt-20 md:pt-[5px] ">
      {/* FULL VIDEO PLAYER OVERLAY */}
      {isWatchingFull && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <button
            onClick={handleExitFullVideo}
            className="absolute top-5 left-5 z-[110] bg-white/20 hover:bg-white/40 text-white px-6 py-2 rounded-lg backdrop-blur-md transition"
          >
            ← Back
          </button>
          <iframe
            ref={fullIframeRef}
            key={`full-${currentVideo?.trailerUrl}`}
            src={getFullVideoUrl(currentVideo?.trailerUrl)}
            className="w-full h-[150%] -translate-y-[15%] object-cover scale-[1.4] opacity-80"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={handleFullIframeLoad}
          ></iframe>
        </div>
      )}

      {/* LEFT SIDE: MAIN PLAYER & MOVIE DETAILS */}
      <div className="w-full md:w-[65%] flex flex-col relative border-r border-gray-800">
        <div className="relative h-[300px] md:h-full bg-black group overflow-hidden">
          {/* ✅ YouTube Background Video */}
          {upcomingTrailers.length > 0 ? (
            <>
              {!isWatchingFull && (
                <div className="absolute inset-0">
                  <iframe
                    ref={bgIframeRef}
                    key={`bg-${currentVideo?.trailerUrl}`}
                    src={getEmbedUrl(currentVideo?.trailerUrl)}
                    className="w-full h-[150%] -translate-y-[15%] object-cover scale-[1.4] pointer-events-none opacity-80"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    onLoad={handleBgIframeLoad}
                  ></iframe>
                </div>
              )}

              {/* Cinematic Overlays */}

              <div className="absolute inset-0 bg-gradient-to-t from-[#2b2c2e]/40 via-[#0a0d14]/40 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-transparent to-transparent pointer-events-none"></div>

              {/* ✅ VOLUME TOGGLE BUTTON */}
              <button
                onClick={toggleVolume}
                className="absolute right-6 bottom-12 md:bottom-20 lg:bottom-12 z-30 bg-black/40 hover:bg-white/20 p-3 rounded-full border border-white/10 transition-all active:scale-90"
                title={isBgMuted ? "Unmute background" : "Mute background"}
              >
                {isBgMuted ? (
                  <HiVolumeOff size={18} />
                ) : (
                  <HiVolumeUp size={18} className="text-orange-400" />
                )}
              </button>

              {/* Navigation Controls */}

              {upcomingTrailers.length > 1 && (
                <>
                  <button
                    onClick={() => paginate(-1)}
                    className={`absolute -left-2 top-1/2 md:left-1 -translate-y-1/2 z-30 p-2 rounded-full transition
        ${
          currentIndex === 0
            ? "bg-black/20 opacity-30 cursor-not-allowed"
            : "bg-black/40 hover:bg-white/10 cursor-pointer lg:opacity-0 group-hover:opacity-100"
        }
      `}
                  >
                    <HiChevronLeft className="text-lg md:text-2xl lg:text-3xl" />
                  </button>
                  {currentIndex < upcomingTrailers.length - 1 && (
                    <button
                      onClick={() => paginate(1)}
                      className="absolute -right-2 md:right-1 top-1/2 -translate-y-1/2 z-30 bg-black/40 p-2 rounded-full hover:bg-white/10 cursor-pointer lg:opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiChevronRight className="text-lg md:text-2xl lg:text-3xl" />
                    </button>
                  )}
                </>
              )}

              {/* ✅ MOVIE DETAILS SECTION (Image style implementation) */}
              <div className="absolute bottom-12 md:bottom-20 lg:bottom-12 left-6 md:left-12 z-20 max-w-[90%] md:max-w-[70%] space-y-4">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {/* Title / Logo Style */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl  uppercase tracking-tighter drop-shadow-lg text-white mb-2">
                      {currentVideo?.title}
                    </h1>

                    {/* Metadata (IMDb, Year, Duration, Language) */}
                    {/* <div className="flex flex-wrap items-center gap-3 text-[14px] font-bold text-gray-300">
              <span className="text-blue-400 font-extrabold tracking-wide">
                IMDb {currentVideo?.imdbRating || "8.5"}
              </span>
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
              <span className="text-white bg-blue-600/20 px-2 py-0.5 rounded text-[11px] uppercase">
                Newly Added
              </span>
            </div> */}

                    <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-[13px] text-white/90">
                      <div className="flex items-center gap-2">
                        {renderReleaseStatus()}
                      </div>
                      <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                      {/* Duration: Empty -> TBA (Dim) */}
                      <div className="flex items-center">
                        {renderDuration()}
                      </div>
                      <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                      <span className="border border-white/40 px-1.5 rounded text-[10px]">
                        {currentVideo?.certification || "U/A"}
                      </span>
                      <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                      <div className="flex items-center gap-2">
                        {currentVideo?.language?.map((lang, index) => (
                          <React.Fragment key={index}>
                            <span>{lang}</span>
                            {/* Last language-ku aprom dots (dot separator) vara koodathu */}
                            {index < currentVideo.language.length - 1 && (
                              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[13px] md:text-[14px] hidden md:hidden lg:block text-gray-300 leading-relaxed line-clamp-3  max-w-xl drop-shadow-md">
                      {currentVideo?.longDescription || "TBA"}
                    </p>

                    {/* Genres */}
                    {/* ✅ Dynamic Genres with Dot Separator */}
                    <div className="flex flex-wrap items-center gap-1 text-[10px] md:text-[13px]  text-white/80">
                      {currentVideo?.genres &&
                      currentVideo.genres.length > 0 ? (
                        currentVideo.genres.map((genre, idx) => (
                          <React.Fragment key={idx}>
                            <span
                              key={idx}
                              className="px-1 py-1 text-[12px] font-bold tracking-wider text-orange-400  drop-shadow-[0_0_12px_rgba(251,146,60,0.9)] hover:drop-shadow-[0_0_15px_rgba(251,146,60,1)] transition-all duration-300 cursor-default"
                            >
                              {genre}
                            </span>
                            {/* Last genre-ku aprom dot vara koodathu */}
                            {idx < currentVideo.genres.length - 1 && (
                              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        /* Data illana mattum default-ah ithu show aagum */
                        <span>Action • Drama • Thriller</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-4">
                      <button
                        onClick={handleWatchNow}
                        className="bg-gradient-to-r from-orange-600 to-orange-300 hover:opacity-75 cursor-pointer text-white  py-3 px-8 md:px-9 rounded-lg transition transform active:scale-95 shadow-xl flex items-center gap-3 text-sm md:text-base"
                      >
                        <FaPlay size={14} /> <span>WATCH NOW</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </> // ✅ EMPTY STATE ONLY LEFT SIDE
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[4px]">
              <div className="text-center group p-10">
                {/* Minimal Video Icon with Slash */}
                <div className="relative inline-flex mb-6">
                  <div className="p-5 bg-white/5 rounded-full border border-white/10 group-hover:border-red-500/50 transition-all duration-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500 group-hover:text-red-500 transition-colors duration-500"
                    >
                      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" />
                      <rect width="12" height="10" x="2" y="7" rx="2" />
                      <line
                        x1="2"
                        y1="2"
                        x2="22"
                        y2="22"
                        className="stroke-red-600 opacity-80"
                      />
                    </svg>
                  </div>

                  {/* Subtle Glow Effect */}
                  <div className="absolute inset-0 bg-red-600/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Clean Text Section */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-widest text-white uppercase italic">
                    Trailers Not Available
                  </h2>

                  <div className="flex justify-center items-center gap-3">
                    <div className="h-[1px] w-8 bg-gray-700" />
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                      Stay Tuned
                    </p>
                    <div className="h-[1px] w-8 bg-gray-700" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: NEWS LIST */}
      <div className="w-full md:w-[32%] bg-[#0d1017] flex flex-col border-l mt-20 md:mt-0 border-gray-800/50">
        <div className="p-5 border-b border-gray-800/50 flex justify-between items-center">
          <h3 className="text-gray-400 uppercase text-[11px] font-black tracking-[0.25em]">
            Trending News
          </h3>
          <Link
            to="/news"
            className="text-gray-400 uppercase text-[10px] font-bold tracking-[0.1em] flex items-center gap-1.5 hover:text-white transition-colors"
          >
            See All <FaAngleRight />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
          {activeBlogs.map((blog) => (
            <div key={blog.id} className="flex gap-4 group cursor-pointer">
              <div className="flex-1">
                <h4 className="text-[14px] font-bold text-white/80 group-hover:text-blue-400 leading-snug mb-1 transition-colors line-clamp-2">
                  {blog.title}
                </h4>
                <p className="text-gray-500 text-[11px] line-clamp-1 font-medium">
                  {blog.newsDate}
                </p>
              </div>
              <div className="shrink-0">
                <div className="w-20 h-14 rounded-md overflow-hidden shadow-md grayscale group-hover:grayscale-0 transition-all duration-500 border border-white/5">
                  <img
                    src={blog.bannerImage}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
