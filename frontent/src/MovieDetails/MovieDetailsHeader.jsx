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
} from "lucide-react";
import { FaPlay } from "react-icons/fa";
import VideoPlayer from "../Components/VideoPlayer";
import MovieDescriptionSection from "./MovieDescriptionSection";
import { CiStreamOn } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion"; // Framer Motion Import

const MovieDetailsHeader = ({ movie }) => {
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const trailerUrl = "https://youtu.be/zdu0YzzJ10o?si=tEbfZkJtD4F5ELlk";
  const [activeModal, setActiveModal] = useState(null); // 'boxOffice', 'theater', 'ott'

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

  const ottPlatforms = availableOn.length > 0 ? availableOn.join(",") : "--/--";
  const streamDate = getValue(movie?.ottReleaseDate);
  const quality =
    streamInfo?.quality && streamInfo.quality.length > 0
      ? streamInfo.quality.join(", ")
      : "--/--";
  const languageText = languages.length > 0 ? languages.join(", ") : "--/--";

  // fallback (optional strong logic)
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

  const ottArray = availableOn.length > 0 ? availableOn : [];

  const languageArray = languages.length > 0 ? languages : [];

  const isBoxOfficeAvailable = !!overAllBoxOffice;

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

  useEffect(() => {
    if (isGalleryOpen || activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isGalleryOpen, activeModal]);

  const genres = parseData(movie?.genres);

  const getYouTubeID = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

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
        {/* 🔥 SINGLE LINE CHIP ROW */}
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

        {/* 🔥 SHOW MORE */}
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

  const videoId = getYouTubeID(movie.trailerUrl);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  // 1. Safe Parse Gallery Links
  const galleryArray = parseData(movie?.galleryLinks) || [];

  // 2. Thumbnail Logic for Gallery
  const getDisplayThumbnail = () => {
    if (galleryArray.length > 0) {
      const firstVideoId = getYouTubeID(galleryArray[0]);
      return `https://img.youtube.com/vi/${firstVideoId}/maxresdefault.jpg`;
    }
    const trailerVideoId = getYouTubeID(movie.trailerUrl);
    return `https://img.youtube.com/vi/${trailerVideoId}/maxresdefault.jpg`;
  };

  // Slider Navigation Logic
  const nextImage = (e) => {
    e.stopPropagation();
    if (currentIndex < galleryArray.length - 1)
      setCurrentIndex((prev) => prev + 1);
  };
  const prevImage = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  // 2. PC Double Click Logic
  const handleDoubleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // Click panna idathoda X position
    const width = rect.width;

    if (x > width / 2) {
      nextImage(); // Right side double click
    } else {
      prevImage(); // Left side double click
    }
  };

  // 3. Swipe Logic for Framer Motion
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const onDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      nextImage();
    } else if (swipe > swipeConfidenceThreshold) {
      prevImage();
    }
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

  //intha ui fist ok sonna UI

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
      className={`flex flex-col justify-center border-l-[4px] border-y border-r border-y-white/15 border-r-white/5 bg-transparent min-w-[140px] h-[55px] pl-4 rounded-l-xl transition-all duration-300 ${borderColor} ${glowColor || "hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"} ${onClick ? "cursor-pointer" : "pointer-events-none opacity-50"}`}
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

  const StatBox = ({ label, value, color = "text-white", icon, type }) => (
    <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
      <div className="flex items-center gap-1.5 mb-1">
        {icon && <span className="text-zinc-400">{icon}</span>}
        <span className="text-zinc-200 text-[12px]  uppercase tracking-wider">
          {label}
        </span>
      </div>
      {/* 🔥 CHIP UI */}
      {type === "chips" ? (
        value
      ) : (
        <p className="text-[13px] pt-1 text-white">{value}</p>
      )}
    </div>
  );

  //ithu second sonns ok UI
  const InfoStat = ({ label, value, icon, onClick, underlineColor }) => {
    const isActive = !!onClick;
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center justify-center min-w-[95px] cursor-pointer group ${
          isActive ? "cursor-pointer group" : "opacity-50 pointer-events-none"
        }`}
      >
        {/* VALUE + ICON */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            {/* ICON */}
            {icon && (
              <span
                className={`transition ${
                  isActive ? "group-hover:scale-110 opacity-80" : "opacity-50"
                }`}
              >
                {icon}
              </span>
            )}

            {/* VALUE */}
            <span className="text-[15px] font-semibold text-white tracking-tight">
              {value}
            </span>
          </div>

          {/* 🔥 GRADIENT UNDERLINE (FIXED WIDTH) */}
          <div
            className={`mt-1 h-[2px] w-[40px] rounded-full opacity-50 transition-all duration-300 ${isActive ? "group-hover:opacity-100 opacity-20" : ""}`}
            style={{
              background: `linear-gradient(to right, transparent, ${underlineColor}, transparent)`,
            }}
          />
        </div>

        {/* LABEL */}
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
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 uppercase tracking-widest">
              {label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {icon && <span className="opacity-80">{icon}</span>}
            {/* VALUE */}
            <span className="text-[14px] font-semibold text-white">
              {value}
            </span>
          </div>
        </div>

        {/* UNDERLINE */}
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
    <div className="bg-[#121212] text-white  font-sans">
      {/* 1. Movie Title and Ratings Section - Responsive Flex */}
      <div className="pt-6 pb-3  md:pt-8 md:pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 ">
        {/* Left Side: Title & Info */}
        <div className="flex flex-col md:flex-col lg:flex-1  space-y-2 md:space-y-3 lg:space-y-4 ">
          <div className="flex flex-wrap items-center gap-4">
            {/* Cinematic Title */}
            <h1
              title={`Movie: ${movie.title}`}
              className="text-4xl truncate max-w-[300px]   text-white tracking-[1px] drop-shadow-2xl"
            >
              {movie.title}
            </h1>

            <div className="flex items-center gap-2">
              {/* Certification Badge with Glow */}
              <span className="px-3 py-1 bg-gradient-to-br from-zinc-800 to-black border border-zinc-700/50 rounded-md font-bold text-[13px] text-zinc-200 tracking-widest uppercase shadow-[0_10px_20px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.4)] ring-1 ring-white/10 ring-inset">
                {getReleaseYear()}
              </span>
              <span className="px-3 py-1 bg-gradient-to-br from-zinc-800 to-black border border-zinc-700/50 rounded-md font-bold text-[12px] text-zinc-200 tracking-widest uppercase shadow-[0_10px_20px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.4)] ring-1 ring-white/10 ring-inset">
                {movie.certification}
              </span>
              {/* 🔥 DOT */}
              {/* <span className="w-1 h-1 rounded-full bg-zinc-200 shadow-[0_0_8px_rgba(255,255,255,0.2)]" /> */}
              {/* 🔥 YEAR */}
            </div>
          </div>

          {/* UPDATED: GENRES & RUNNING HOURS CARDS */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2 bg-zinc-800/40 backdrop-blur-md rounded-xl border border-white/5">
              <Clock size={14} className="text-zinc-500" />
              <span className="text-[11px] font-semibold text-zinc-300  tracking-widest">
                RUNTIME:{" "}
                <span className="text-white ml-1">
                  {movie.durationOrSeason || "TBA"}
                </span>
              </span>
            </div>
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
                    {/* {index !== genres.length - 1 && (
                        <span className="w-1 h-1 rounded-full bg-zinc-200 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                      )} */}
                  </div>
                ))}
              </div>
            </div>
            {/* Running Hours Card */}
          </div>
        </div>

        {/* Right Side: Attractive Gradient Rating Card */}
        <div className="md:flex hidden  flex-wrap items-center gap-6">
          {/* --- RATING ITEM --- */}

          {/* <InfoCard
              label="Rating"
              value={`${movie.imdbRating}/10`}
              icon={
                <Star
                  className="text-yellow-500 fill-yellow-500"
                  size={12}
                  borderColor="border-l-yellow-500"
                />
              }
            /> */}

          <InfoStat
            label="Rating"
            value={`${movie.imdbRating}/10`}
            icon={
              <Star className="text-yellow-500 fill-yellow-500" size={14} />
            }
            underlineColor="#eab308" // yellow-500
          />
          {/* 
            <InfoCard
              label="Box Office"
              value={displayBoxOffice}
              icon={<TrendingUp className="text-green-500" size={12} />}
              borderColor={"border-l-green-500 !border-y-green-300/20"}
              glowColor={
                isBoxOfficeAvailable
                  ? "hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                  : ""
              }
              onClick={
                isBoxOfficeAvailable ? () => setActiveModal("boxOffice") : null
              }
              // onClick={() => setActiveModal("boxOffice")}
            /> */}

          <InfoStat
            label="Box Office"
            value={displayBoxOffice}
            // icon={<TrendingUp className="text-green-500" size={14} />}
            onClick={
              isBoxOfficeAvailable ? () => setActiveModal("boxOffice") : null
            }
            underlineColor="#22c55e" // green-500
          />

          {/* --- THEATER RELEASE ITEM --- */}
          {/* <InfoCard
              label="Theater"
              value={movie.theatreReleaseDate}
              icon={<Ticket className="text-blue-500" size={12} />}
              borderColor="border-l-blue-500 !border-y-blue-300/20"
              glowColor="hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
              onClick={
                isTheaterAvailable ? () => setActiveModal("theater") : null
              }
            /> */}

          <InfoStat
            label="Theater"
            value={movie.theatreReleaseDate || "TBA"}
            // icon={<Ticket className="text-blue-500" size={14} />}
            onClick={
              isTheaterAvailable ? () => setActiveModal("theater") : null
            }
            underlineColor="#3b82f6" // blue-500
          />

          {/* --- OTT RELEASE ITEM --- */}
          {/* 
            <InfoCard
              label="OTT Stream"
              value={movie.ottReleaseDate || "TBA"}
              icon={<Monitor className="text-purple-500" size={12} />}
              borderColor="border-l-purple-500 !border-y-purple-300/20"
              glowColor="hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              onClick={isOTTAvailable ? () => setActiveModal("ott") : null}
            /> */}
          <InfoStat
            label="OTT"
            value={movie.ottReleaseDate || "TBA"}
            // icon={<Monitor className="text-purple-500" size={14} />}
            onClick={isOTTAvailable ? () => setActiveModal("ott") : null}
            underlineColor="#a855f7" // purple-500
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
        <div className="order-1 lg:order-none md:col-span-3 grid grid-cols-12 gap-2 h-[150px] md:h-full">
          {/* Poster */}
          {/* --- POSTER / GALLERY THUMBNAIL CLICKABLE --- */}
          <div
            onClick={() => galleryArray.length > 0 && setIsGalleryOpen(true)}
            className="col-span-4 md:col-span-12 relative mb-1 md:mb-0 group overflow-hidden rounded-lg cursor-pointer"
          >
            <img
              src={getDisplayThumbnail()}
              alt="Gallery Preview"
              className="w-full h-full object-cover saturate-125 border-r border-white/10"
            />
            <div className="absolute top-0 left-0 p-1 md:p-2 bg-black/40">
              <Plus size={20} />
            </div>
            {galleryArray.length > 1 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px] group-hover:bg-black/40 transition-all">
                <div className="flex items-center gap-1">
                  <Plus size={18} className="text-white font-bold" />
                  <span className="text-lg font-bold text-white">
                    {galleryArray.length}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-8 md:hidden flex flex-col">
            <MobileInfoCard
              label="Rating"
              value={`${movie.imdbRating}/10`}
              icon={
                <Star className="text-yellow-500 fill-yellow-500" size={14} />
              }
              underlineColor="#eab308"
            />

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
        <div className="order-1 md:col-span-9 md:mr-3 md:order-2 lg:order-none   relative rounded-lg group overflow-hidden aspect-video md:aspect-auto">
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
              {/* <div className="absolute bottom-4 left-4 hidden md:block">
                  <h2 className="text-2xl tracking-[0.5rem] font-light uppercase opacity-90">
                    D H A N U S H
                  </h2>
                </div> */}
            </div>
          )}
        </div>

        {/* --- FRAMER MOTION GALLERY MODAL --- */}
        <AnimatePresence>
          {isGalleryOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] bg-black/95 pt-0 md:pt-20 flex items-center justify-center p-4"
              onClick={() => setIsGalleryOpen(false)}
            >
              {/* Close Button */}
              <button className="absolute top-20 right-[45%] md:hidden text-white/70 hover:text-white transition-colors">
                <X size={32} />
              </button>
              {/* Main Image Container */}
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative max-w-5xl w-full aspect-video flex items-center justify-center "
                onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking image
              >
                {/* 2. Floating Attractive Index Badge (1/5) */}
                <div className="absolute  -bottom-[50px] md:-bottom-[30px] lg:bottom-[20px] left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/10 border border-white/20 backdrop-blur-xl rounded-full shadow-2xl">
                  <span className="text-xs font-bold tracking-[0.2em] text-white/90">
                    {currentIndex + 1}{" "}
                    <span className="text-white/30 mx-1">|</span>{" "}
                    {galleryArray.length}
                  </span>
                </div>
                {/* Prev Button */}
                {currentIndex > 0 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-[-20px] hidden md:hidden lg:block md:left-[-60px] p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                  >
                    <ChevronLeft size={40} />
                  </button>
                )}

                {/* Slider Image */}
                <div>
                  <motion.img
                    key={currentIndex}
                    src={`https://img.youtube.com/vi/${getYouTubeID(galleryArray[currentIndex])}/maxresdefault.jpg`}
                    alt="Gallery"
                    // Drag Logic
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = Math.abs(offset.x) * velocity.x;
                      // Swipe Left (Next)
                      if (
                        swipe < -1000 &&
                        currentIndex < galleryArray.length - 1
                      ) {
                        setCurrentIndex((prev) => prev + 1);
                      }
                      // Swipe Right (Prev)
                      else if (swipe > 1000 && currentIndex > 0) {
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

                {/* Next Button */}
                {currentIndex < galleryArray.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-[-20px] md:right-[-60px] p-2 hidden md:hidden lg:block bg-white/10 hover:bg-white/20 rounded-full transition-all"
                  >
                    <ChevronRight size={40} />
                  </button>
                )}

                {/* Counter Indicator inside Modal */}
                {/* <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-widest">
                  {currentIndex + 1} / {galleryArray.length}
                </div> */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
