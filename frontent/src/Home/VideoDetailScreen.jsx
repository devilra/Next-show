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
  const [isMuted, setIsMuted] = useState(true); // ✅ Global Volume/Play Toggle State
  const iframeRef = useRef(null); // ✅ Iframe-ai control panna ref
  const [direction, setDirection] = useState(0); // 2. Direction track panna state

  // ✅ Extract and Merge Upcoming Trailers logic
  const upcomingTrailers = [
    ...(activeVideos?.theatrical?.upcoming || []),
    ...(activeVideos?.streaming?.upcoming || []),
  ];

  const currentVideo = upcomingTrailers[currentIndex];

  // console.log("Current Video", upcomingTrailers);

  // ✅ Volume control logic (Without reloading iframe)
  useEffect(() => {
    if (iframeRef.current) {
      const command = isMuted ? "mute" : "unMute";

      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: command, args: [] }),
        "*",
      );
    }
  }, [isMuted]);

  // ✅ YouTube Normal URL-ai Embed URL-ah mathura function
  const getEmbedUrl = (url) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\b\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;

    if (!videoId) return;

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1&enablejsapi=1`;
  };

  const getFullVideoUrl = (url) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\b\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0`
      : "";
  };

  const handleWatchNow = () => setIsWatchingFull(true);
  const handleExitFullVideo = () => setIsWatchingFull(false);

  // ✅ Toggle Volume/Play Function
  const toggleVolume = () => {
    setIsMuted(!isMuted);
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

  const paginate = (newDirection) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentIndex((prev) => (prev + 1) % upcomingTrailers.length);
    } else {
      setCurrentIndex((prev) =>
        prev > 0 ? prev - 1 : upcomingTrailers.length - 1,
      );
    }
  };

  if (upcomingTrailers.length === 0) {
    return (
      <div className="h-[450px] bg-[#0a0d14] flex  items-center justify-center text-gray-500 font-medium">
        No Upcoming Trailers Found
      </div>
    );
  }

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
            ref={iframeRef} // ✅ Connect ref
            key={currentVideo?.trailerUrl} // ✅ Video maarumpothu matum reload aagum
            src={getFullVideoUrl(currentVideo?.trailerUrl)}
            className="w-full h-[150%] -translate-y-[15%] object-cover scale-[1.4] opacity-80"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      )}

      {/* LEFT SIDE: MAIN PLAYER & MOVIE DETAILS */}
      <div className="w-full md:w-[65%] flex flex-col relative border-r border-gray-800">
        <div className="relative h-[300px] md:h-full bg-black group overflow-hidden">
          {/* ✅ YouTube Background Video */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 "
            >
              <iframe
                ref={iframeRef} // 👈 Inga thaan 'ref' irukanum
                src={getEmbedUrl(currentVideo?.trailerUrl)}
                className="w-full h-[150%] -translate-y-[15%] object-cover scale-[1.4] opacity-80"
                frameBorder="0"
                allow="autoplay; encrypted-media"
              ></iframe>
            </motion.div>
          </AnimatePresence>

          {/* Cinematic Overlays */}

          <div className="absolute inset-0 bg-gradient-to-t from-[#2b2c2e]/40 via-[#0a0d14]/40 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-transparent to-transparent pointer-events-none"></div>

          {/* ✅ VOLUME TOGGLE BUTTON */}
          <button
            onClick={toggleVolume}
            className="absolute right-6 bottom-12 md:bottom-20 lg:bottom-12 z-30 bg-black/40 hover:bg-white/20 p-3 rounded-full border border-white/10 transition-all active:scale-90"
            title={isMuted ? "Unmute & Play" : "Mute & Stop"}
          >
            {isMuted ? (
              <HiVolumeOff size={18} />
            ) : (
              <HiVolumeUp size={18} className="text-orange-400" />
            )}
          </button>

          {/* Navigation Controls */}
          <button
            onClick={() => paginate(-1)}
            className="absolute -left-2 top-1/2 md:left-1 cursor-pointer -translate-y-1/2 z-30 bg-black/40 p-2 rounded-full hover:bg-white/10 lg:opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <HiChevronLeft className="text-lg md:text-2xl lg:text-3xl" />
          </button>

          <button
            onClick={() => paginate(1)}
            className="absolute -right-2 md:right-1 cursor-pointer top-1/2 -translate-y-1/2 z-30 bg-black/40 p-2 rounded-full hover:bg-white/10 lg:opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <HiChevronRight className="text-lg md:text-2xl lg:text-3xl" />
          </button>

          {/* ✅ MOVIE DETAILS SECTION (Image style implementation) */}
          <div className="absolute bottom-12 md:bottom-20 lg:bottom-12 left-6 md:left-12 z-20 max-w-[90%] md:max-w-[70%] space-y-4">
            <AnimatePresence mode="wait">
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
                  <span>
                    {currentVideo?.theatreReleaseDate
                      ? new Date(currentVideo?.theatreReleaseDate).getFullYear()
                      : "TBA"}
                  </span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                  <span>{currentVideo?.durationOrSeason || "2h 45m"}</span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                  <span className="border border-white/40 px-1.5 rounded text-[10px]">
                    {currentVideo.certification}
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
                <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-[13px]  text-white/80">
                  {currentVideo?.genres && currentVideo.genres.length > 0 ? (
                    currentVideo.genres.map((genre, idx) => (
                      <React.Fragment key={idx}>
                        <span>{genre}</span>
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
