import React, { useState } from "react";
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
} from "lucide-react";
import { FaPlay } from "react-icons/fa";
import VideoPlayer from "../Components/VideoPlayer";
import MovieDescriptionSection from "./MovieDescriptionSection";
import { CiStreamOn } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion"; // Framer Motion Import

const MovieDetailsHeader = ({ movie }) => {
  console.log("Movie Details Header", movie);

  const [isPlaying, setIsPlaying] = useState(false);
  const trailerUrl = "https://youtu.be/zdu0YzzJ10o?si=tEbfZkJtD4F5ELlk";
  const [activeModal, setActiveModal] = useState(null); // 'boxOffice', 'theater', 'ott'

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

  const getYouTubeID = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeID(movie.trailerUrl);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const modalContent = {
    boxOffice: {
      title: "FINANCIAL STATS",
      subtitle: "Global Collection Report",
      accent: "green",
      stats: [
        { label: "Budget", value: "₹150 Crores", icon: <Landmark size={14} /> },
        {
          label: "Worldwide",
          value: "₹295 Crores",
          icon: <Globe size={14} />,
          color: "text-green-400",
        },
        { label: "Domestic", value: "₹210 Crores" },
        { label: "International", value: "₹85 Crores" },
      ],
      footerLabel: "Final Verdict",
      footerValue: "Blockbuster",
    },
    theater: {
      title: "THEATRICAL INFO",
      subtitle: "Cinema Release Details",
      accent: "blue",
      stats: [
        {
          label: "Release Date",
          value: movie.theatreReleaseDate,
          icon: <Calendar size={14} />,
        },
        {
          label: "Screens",
          value: "3500+ Worldwide",
          icon: <MapPin size={14} />,
        },
        { label: "Format", value: "IMAX, 4K, Atmos" },
        { label: "Distributor", value: "Red Giant Movies" },
      ],
      footerLabel: "Status",
      footerValue: "In Theaters Now",
    },
    ott: {
      title: "STREAMING INFO",
      subtitle: "Digital Premiere Details",
      accent: "purple",
      stats: [
        { label: "OTT Platform", value: "Netflix", icon: <Tv size={14} /> },
        {
          label: "Stream Date",
          value: movie.ottReleaseDate || "TBA",
          icon: <Calendar size={14} />,
        },
        {
          label: "Quality",
          value: "Ultra HD (HDR10+)",
          icon: <Zap size={14} />,
        },
        { label: "Languages", value: "Tamil, Telugu, Hindi" },
      ],
      footerLabel: "Availability",
      footerValue: movie.ottReleaseDate
        ? "Streaming Soon"
        : "Date Not Confirmed",
    },
  };

  const currentData = modalContent[activeModal];

  const InfoCard = ({
    label,
    value,
    icon,
    borderColor,
    glowColor,
    onClick,
  }) => (
    <motion.div
      onClick={onClick}
      className={`flex flex-col justify-center border-l-[4px] border-y border-r border-y-white/15 border-r-white/5 bg-transparent min-w-[140px] h-[55px] pl-4 rounded-l-xl transition-all duration-300 ${borderColor} ${glowColor || "hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"} ${onClick ? "cursor-pointer" : ""}`}
      // className="flex flex-col cursor-pointer justify-center border-l-[4px] border-y border-r border-y-white/15 border-r-white/5 border-l-zinc-400 bg-transparent min-w-[130px] h-[55px] pl-4 rounded-l-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
    >
      <span className="text-[10px] font-black text-zinc-500 tracking-[1px] uppercase flex items-center gap-1.5">
        {label} {icon}
      </span>
      <span className="text-[14px]  text-zinc-200 pt-1  tracking-wider">
        {value}
      </span>
    </motion.div>
  );

  const StatBox = ({ label, value, color = "text-white", icon }) => (
    <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
      <div className="flex items-center gap-1.5 mb-1">
        {icon && <span className="text-zinc-400">{icon}</span>}
        <span className="text-zinc-200 text-[12px]  uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={`text-[15px] pt-1  leading-tight ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="bg-[#121212] text-white  font-sans">
      {/* 1. Movie Title and Ratings Section - Responsive Flex */}
      <div className="py-8 md:py-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
        {/* Left Side: Title & Info */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Cinematic Title */}
            <h1
              title={`Movie: ${movie.title}`}
              className="text-2xl truncate max-w-[300px]  font-black  text-white tracking-[1px] drop-shadow-2xl"
            >
              {movie.title}
            </h1>

            {/* Certification Badge with Glow */}
            <span className="px-3 py-1 bg-gradient-to-br from-zinc-800 to-black border border-zinc-700/50 rounded-md font-bold text-[10px] text-zinc-200 tracking-widest uppercase shadow-[0_10px_20px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.4)] ring-1 ring-white/10 ring-inset">
              {movie.certification}
            </span>
          </div>

          {/* UPDATED: GENRES & RUNNING HOURS CARDS */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Genres Card */}
            <div className="flex items-center gap-3 px-4 py-2 bg-zinc-800/40 backdrop-blur-md rounded-xl border border-white/5">
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest border-r border-white/10 pr-3">
                Genres
              </span>
              <div className="flex flex-wrap gap-1">
                {genres.map((genre, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span
                      key={index}
                      className="px-3 py-1 border border-gray-700 text-gray-300/65 rounded-md text-xs md:text-[12px] hover:bg-gray-800/50 transition-colors"
                    >
                      {genre}
                    </span>
                    {/* Conditional Dot: Last item-ah illana mattum dot kaatuvom */}
                    {index !== genres.length - 1 && (
                      <span className="w-1 h-1 rounded-full bg-zinc-200 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Running Hours Card */}
            <div className="flex items-center gap-3 px-4 py-2 bg-zinc-800/40 backdrop-blur-md rounded-xl border border-white/5">
              <Clock size={14} className="text-zinc-500" />
              <span className="text-[11px] font-semibold text-zinc-300  tracking-widest">
                RUNTIME:{" "}
                <span className="text-white ml-1">
                  {movie.durationOrSeason || "TBA"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Attractive Gradient Rating Card */}
        <div className="flex flex-wrap items-center gap-6">
          {/* --- RATING ITEM --- */}

          <InfoCard
            label="Rating"
            value={`${movie.imdbRating}/10`}
            icon={
              <Star
                className="text-yellow-500 fill-yellow-500"
                size={12}
                borderColor="border-l-yellow-500"
              />
            }
          />

          <InfoCard
            label="Box Office"
            value="₹295 Cr"
            icon={<TrendingUp className="text-green-500" size={12} />}
            borderColor="border-l-green-500 !border-y-green-300/20"
            glowColor="hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]"
            onClick={() => setActiveModal("boxOffice")}
          />

          {/* --- THEATER RELEASE ITEM --- */}
          <InfoCard
            label="Theater"
            value={movie.theatreReleaseDate}
            icon={<Ticket className="text-blue-500" size={12} />}
            borderColor="border-l-blue-500 !border-y-blue-300/20"
            glowColor="hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            onClick={() => setActiveModal("theater")}
          />

          {/* --- OTT RELEASE ITEM --- */}

          <InfoCard
            label="OTT Stream"
            value={movie.ottReleaseDate || "TBA"}
            icon={<Monitor className="text-purple-500" size={12} />}
            borderColor="border-l-purple-500 !border-y-purple-300/20"
            glowColor="hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
            onClick={() => setActiveModal("ott")}
          />
        </div>
      </div>

      {/* --- BOX OFFICE MODAL (Framer Motion) --- */}
      {/* --- REUSABLE DYNAMIC MODAL --- */}
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
              {/* Background Glow based on accent */}
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
                  <h3 className="text-2xl font-semibold tracking-wider text-white ">
                    {currentData.title}
                  </h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                    {currentData.subtitle}
                  </p>
                </div>
                {/* <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={20} className="text-zinc-400" />
                </button> */}
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

      {/* 2. Visuals Section - Mobile-la stack aagum */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-2 md:h-[450px]">
        {/* Poster & Sidebar Horizontal on Mobile, Vertical on Desktop */}
        <div className="order-2 md:order-1 lg:order-none md:col-span-3 grid grid-cols-12 gap-5 h-[150px] md:h-full">
          {/* Poster */}
          <div className="col-span-4 md:col-span-12 relative group overflow-hidden rounded-lg cursor-pointer">
            <img
              src={thumbnail}
              alt="Poster"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 p-1 md:p-2 bg-black/40">
              <Plus size={20} />
            </div>
          </div>

          {/* Sidebar Buttons (Videos/Photos) - Mobile-la poster pakathula varum */}
          {/* <div className="col-span-8 md:hidden flex gap-2">
            <div className="flex-1 bg-[#252525] rounded-lg flex flex-col items-center justify-center gap-1">
              <Play size={24} />
              <span className="text-[10px] font-bold uppercase">1 Video</span>
            </div>
            <div className="flex-1 bg-[#252525] rounded-lg flex flex-col items-center justify-center gap-1">
              <ImageIcon size={24} />
              <span className="text-[10px] font-bold uppercase">31 Photos</span>
            </div>
          </div> */}
        </div>

        {/* Video Player Area - Main Focus */}
        <div className="order-1 md:col-span-9 md:mr-3 md:order-2 lg:order-none  bg-black relative rounded-lg group overflow-hidden aspect-video md:aspect-auto">
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
                className="w-full h-full object-cover opacity-80"
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
              {/* <div className="absolute bottom-4 left-4 hidden md:block">
                <h2 className="text-2xl tracking-[0.5rem] font-light uppercase opacity-90">
                  D H A N U S H
                </h2>
              </div> */}
            </div>
          )}
        </div>

        {/* Desktop Sidebar (Only visible on MD up) */}
        {/* <div className="hidden md:flex md:col-span-2 flex-col gap-2">
          <div className="flex-1 bg-[#252525] rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#333]">
            <Play size={32} />
            <span className="text-xs font-bold uppercase">1 Video</span>
          </div>
          <div className="flex-1 rounded-lg bg-[#252525] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#333]">
            <ImageIcon size={32} />
            <span className="text-xs font-bold uppercase">31 Photos</span>
          </div>
        </div> */}
      </div>

      {/* 3. Description Section
      <div className="py-6">
        <MovieDescriptionSection movie={movie} />
      </div> */}
    </div>
  );
};

export default MovieDetailsHeader;
