import React, { useState } from "react";
import { Plus, ChevronRight, Settings, Eye, ExternalLink } from "lucide-react";
import OTTBadge from "../Components/OTTBadge";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Slider from "react-slick";
import { CiShare2 } from "react-icons/ci";
import { OTT_PLATFORMS } from "../ADMIN/Dashboard/CentralizedContent/CentralizedCreateMovie/OttplatFormData";
import { motion, AnimatePresence } from "framer-motion"; // Marakkama mela import pannikonga

const MovieDescriptionSection = ({ movie }) => {
  const [hoveredId, setHoveredId] = useState(null);
  // ⭐ Custom Arrows
  const NextArrow = ({ className, style, onClick }) => (
    <div
      className={`${className} !right-[-35px] !z-20 !w-8 !h-8 flex items-center justify-center rounded-full border border-white/20  hover:from-[#ffffff40] hover:to-[#00000080] transition-all duration-300 cursor-pointer shadow-lg`}
      style={{ ...style, display: "flex" }}
      onClick={onClick}
    >
      <HiChevronRight className="text-white text-xl" />
    </div>
  );

  const PrevArrow = ({ className, style, onClick }) => (
    <div
      className={`${className} !left-[-35px] !z-20 !w-8 !h-8 flex items-center justify-center rounded-full  border border-white/20  hover:from-[#ffffff40] hover:to-[#00000080] transition-all duration-300 cursor-pointer shadow-lg`}
      style={{ ...style, display: "flex" }}
      onClick={onClick}
    >
      <HiChevronLeft className="text-white text-xl" />
    </div>
  );

  // ⭐ Slider Settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    centerMode: true,
    centerPadding: "20px",
    speed: 500,
    slidesToShow: 2, // Default-ah 2 platforms kaatum
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }, // Mobile-la 1 mattum
      },
    ],
  };

  // console.log(movie);

  const parseData = (data) => {
    try {
      let result = data;
      // Data string-aaga irukkum varai parse pannu (Handling "\"[[...]]\"")
      while (typeof result === "string") {
        result = JSON.parse(result);
      }

      return Array.isArray(result) ? result : [];
    } catch (error) {
      // Oru velai plain string-aa irundha (Ex: "Tamil"), adhayae array-vaa maathuvom
      if (typeof data === "string" && data.trim() !== "") {
        return [data];
      }
      return [];
    }
  };

  const genres = parseData(movie?.genres);
  const languages = parseData(movie?.language);

  return (
    <div className="py-6 bg-[#121212] space-y-4 mb-8 text-white">
      {/* --- New Release Dates Section --- */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
        {/* Background subtle glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 blur-[100px] rounded-full" />

        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          {/* Left Side: Release Dates with Glass Cards */}
          <div className="flex flex-col gap-6 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* PRIMARY ACTION: Watch Now or Remind Me */}
              {movie.streamType === "UPCOMING" ? (
                <button className="group relative flex items-center justify-center gap-3 px-8 py-4 w-full sm:w-auto rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95">
                  <svg
                    className="w-5 h-5 group-hover:animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black uppercase tracking-[1px] opacity-80 leading-none mb-1">
                      Coming Soon
                    </span>
                    <span className="text-sm font-bold tracking-wide">
                      REMIND ME
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => window.open(movie.watchUrl, "_blank")}
                  className="group relative flex items-center justify-between gap-4 px-6 py-3 w-full sm:w-auto rounded-2xl bg-orange-500 hover:bg-orange-500/85 cursor-pointer text-white transition-all duration-300 shadow-lg shadow-orange-500/20 active:scale-95"
                >
                  {/* Left: Play Icon & Text */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      {/* <span className="text-[10px] font-black uppercase tracking-[1px] opacity-80 mb-0.5">
                        Stream Now
                      </span> */}
                      <span className="text-sm font-bold tracking-wide">
                        WATCH NOW
                      </span>
                    </div>
                  </div>

                  {/* Right: OTT Image Stack inside the button */}
                  <div className="flex items-center pl-2 border-l border-white/20">
                    <div className="flex -space-x-3">
                      {OTT_PLATFORMS.slice(0, 3).map((platform) => (
                        <motion.div
                          whileHover={{
                            scale: 1.2,
                            zIndex: 50,
                            transition: {
                              duration: 0.2,
                            },
                          }}
                          key={platform.id}
                          className="w-10 h-10 rounded-full border-2 border-orange-500 bg-white overflow-hidden flex items-center justify-center shadow-md"
                        >
                          <img
                            src={platform.logo}
                            alt={platform.name}
                            className="w-full h-full object-contain p-1.5"
                          />
                        </motion.div>
                      ))}

                      {/* More Count if exists */}
                      {OTT_PLATFORMS.length > 3 && (
                        <motion.div
                          whileHover={{ scale: 1.1, zIndex: 50 }}
                          className="w-10 h-10 rounded-full border-2 border-orange-500 bg-zinc-800 flex items-center justify-center text-[10px] font-bold shadow-md"
                        >
                          +{OTT_PLATFORMS.length - 3}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </button>
              )}

              {/* SECONDARY ACTIONS */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Watchlist */}
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-zinc-800/40 border border-white/5 hover:bg-zinc-800/60 hover:border-white/20 text-white transition-all duration-300 group">
                  <svg
                    className="w-5 h-5 text-zinc-400 group-hover:text-red-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Watchlist
                  </span>
                </button>

                {/* Share Actions Container */}
                <div className="flex items-center bg-zinc-800/40 rounded-2xl border border-white/5 p-1">
                  <button
                    onClick={() =>
                      navigator.share({
                        title: movie.title,
                        url: window.location.href,
                      })
                    }
                    className="p-3 hover:bg-zinc-700/50 rounded-xl transition-colors text-zinc-400 hover:text-white"
                    title="Share Movie"
                  >
                    <CiShare2 size={22} />
                  </button>
                  <div className="w-[1px] h-6 bg-white/5 mx-1"></div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }}
                    className="p-3 hover:bg-zinc-700/50 rounded-xl transition-colors text-zinc-400 hover:text-white"
                    title="Copy Link"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full lg:w-auto flex flex-col sm:flex-row items-center  gap-6 p-5 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
            {/* Original Language */}
            {/* <div className="flex flex-col items-center lg:items-start">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[2px] mb-2">
                Original
              </span>
              <div className="flex items-center gap-2">
                {movie.language?.map((lang, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-wide">
                      {lang}
                    </span>
                    {idx !== movie.language.length - 1 && (
                      <div className="w-1 h-1 rounded-full bg-orange-500/60" />
                    )}
                  </div>
                ))}
              </div>
            </div> */}

            {/* Vertical Separator (Desktop) / Horizontal (Mobile) */}
            <div className="hidden sm:block w-[1px] h-10 bg-white/10 mx-2" />
            <div className="sm:hidden w-20 h-[1px] bg-white/10 my-1" />

            {/* Dubbed Languages */}
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[2px] mb-2">
                Available In
              </span>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2">
                {// ✅ Backend-la irunthu vara 'language' field-ai inga use panrom
                (movie.language && movie.language.length > 0
                  ? movie.language
                  : ["Tamil", "Telugu", "Hindi", "Malayalam"]
                ) // Data illana fallback list
                  .map((lang, idx, arr) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="flex items-center tracking-widest text-[10px] gap-3 px-2 py-2 bg-zinc-800/40 backdrop-blur-md rounded-md border border-white/5">
                        {lang}
                      </span>

                      {/* Last item-ku aprom dot (.) vara koodathunu intha condition */}
                      {idx !== arr.length - 1 && (
                        <div className="w-1 h-1 rounded-full bg-zinc-600" />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Side: Streaming Slider Section */}
          {/* <div className="w-full lg:w-[320px] bg-white/5 px-10 py-5 rounded-3xl border border-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-[11px] font-black text-yellow-500 uppercase tracking-[2px]">
                Streaming On
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
              </div>
            </div>

            <div className="relative">
              <Slider {...sliderSettings}>
                {OTT_PLATFORMS.map((platform) => (
                  <div key={platform.id} className="px-2">
                    <div
                      className={`${platform.containerStyle} !w-full !h-[60px] rounded-xl hover:scale-[1.05] transition-all duration-500 flex items-center justify-center grayscale hover:grayscale-0`}
                    >
                      <img
                        src={platform.logo}
                        alt={platform.name}
                        className={`${platform.imageStyle} max-h-[30px] object-contain`}
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div> */}
        </div>
      </div>

      {/* Main Container: Mobile-la flex-col, Desktop-la flex-row (gap-12) */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Side: Info & Cast */}
        <div className="flex-1 order-1">
          <p className="text-base md:text-lg leading-relaxed text-gray-200 mb-6">
            {movie.longDescription}
          </p>

          {/* Director, Writer, Stars List */}
          <div className="space-y-1 border-t border-gray-700">
            <div className="flex items-center py-3 border-b border-gray-700">
              <span className="font-bold w-40 truncate text-sm md:text-base">
                Director
              </span>
              <span className="text-blue-400  ml-2 text-sm md:text-base">
                {movie.director}
              </span>
            </div>

            <div className="flex items-center py-3 border-b border-gray-700">
              <span className="font-bold w-40 truncate text-sm md:text-base">
                Writer
              </span>
              <span className="text-blue-400  ml-2 text-sm md:text-base">
                {movie.writer || "N/A"}
              </span>
            </div>

            <div className="flex items-start md:items-center py-3 border-b border-gray-700 group ">
              <span className="font-bold w-40 truncate shrink-0 text-sm md:text-base">
                Cast
              </span>
              <div className="flex-1 overflow-hidden items-center ml-2">
                {/* line-clamp-2 nu potta 2 lines-ku mela pona truncate aagum */}
                <div className="line-clamp-2 text-sm md:text-base">
                  {movie.cast ? (
                    movie.cast.split(",").map((star, index, array) => (
                      <React.Fragment key={index}>
                        <span className="text-blue-400 ">{star.trim()}</span>
                        {index < array.length - 1 && (
                          <span className="text-white mx-2 font-bold">•</span>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </div>
              </div>
              <div className="ml-auto">
                <ChevronRight
                  className="text-white group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </div>
            </div>
            <div className="flex items-center py-3 border-b border-gray-700">
              <span className="font-bold w-40 truncate text-sm md:text-base">
                Music Director
              </span>
              <span className="text-blue-400  ml-2 text-sm md:text-base">
                {movie.musicDirector || "N/A"}
              </span>
            </div>
            <div className="flex items-center py-3 border-b border-gray-700">
              <span className="font-bold w-40 truncate text-sm md:text-base">
                Producer
              </span>
              <span className="text-blue-400  ml-2 text-sm md:text-base">
                {movie.producer || "N/A"}
              </span>
            </div>

            {/* IMDb Pro Link */}
            {/* <div className="flex items-center pt-4 text-blue-400 text-xs md:text-sm font-medium hover:underline cursor-pointer">
              <span className="text-white font-black italic mr-2">IMDbPro</span>
              <span>See production info at IMDbPro</span>
              <ExternalLink size={14} className="ml-1" />
            </div> */}
          </div>
        </div>

        {/* Right Side: Streaming & Watchlist - Mobile-la order-2 (Description-ku kila varum) */}
        <div className="w-full lg:w-80 shrink-0 space-y-6 order-2">
          {/* Watchlist Section (Uncommented and Responsive) */}
          {/* <div className="space-y-2">
            <div className="flex w-full">
              <button className="flex-1 bg-[#f5c518] hover:bg-[#e2b616] text-black font-bold py-3 px-4 rounded-l-md flex items-center justify-center gap-2">
                <Plus size={20} strokeWidth={3} />
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-sm md:text-base">Add to Watchlist</span>
                  <span className="text-[10px] font-normal opacity-80">
                    Added by 2.3K users
                  </span>
                </div>
              </button>
              <button className="bg-[#f5c518] hover:bg-[#e2b616] text-black border-l border-black/20 px-3 rounded-r-md">
                <ChevronRight className="rotate-90" size={20} />
              </button>
            </div>

            <button className="w-full bg-[#2c2c2c] hover:bg-[#3d3d3d] text-white py-3 rounded-md flex items-center justify-center gap-2 transition-colors">
              <Eye size={20} className="text-blue-400" />
              <span className="font-semibold text-sm md:text-base">
                Mark as watched
              </span>
            </button>
          </div> */}

          {/* Streaming Info */}

          {/* Reviews Info */}
          {/* <div className="flex gap-6 text-blue-400 text-xs md:text-sm font-medium border-t border-gray-800 lg:border-none pt-4 lg:pt-0">
            <span className="hover:underline cursor-pointer">
              129{" "}
              <span className="text-gray-400 font-normal">User reviews</span>
            </span>
            <span className="hover:underline cursor-pointer">
              5{" "}
              <span className="text-gray-400 font-normal">Critic reviews</span>
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MovieDescriptionSection;
