import React, { useState } from "react";
import Slider from "react-slick";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { ChevronRight, X, ChevronLeft, VideoOff, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VideoPlayer from "../Components/VideoPlayer"; // Unga trailer component-la irukura video player

// ⭐ Arrows Reusable
const NextArrow = ({ className, style, onClick }) => {
  const isDisabled = className?.includes("slick-disabled");
  return (
    <div className="hidden lg:block">
      <div
        className={`${className} !right-[-25px] !z-20 !w-12 !h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#ffffff25] to-[#00000055] border border-white/20 backdrop-blur-md hover:from-[#ffffff40] hover:to-[#00000080] transition-all duration-300 cursor-pointer shadow-lg ${isDisabled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        style={{ ...style, display: "flex" }}
        onClick={onClick}
      >
        <HiChevronRight className="text-white text-3xl drop-shadow-xl" />
      </div>
    </div>
  );
};

const PrevArrow = ({ className, style, onClick }) => {
  const isDisabled = className?.includes("slick-disabled");
  return (
    <div className="hidden lg:block">
      <div
        className={`${className} !left-[-25px] !z-20 !w-12 !h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#ffffff25] to-[#00000055] border border-white/20 backdrop-blur-md hover:from-[#ffffff40] hover:to-[#00000080] transition-all duration-300 cursor-pointer shadow-lg ${isDisabled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        style={{ ...style, display: "flex" }}
        onClick={onClick}
      >
        <HiChevronLeft className="text-white text-3xl drop-shadow-xl" />
      </div>
    </div>
  );
};

const MovieGallery = ({ movie }) => {
  const [selectedIdx, setSelectedIdx] = useState(null);

  // Backend data: mediaLinks array expected to have YouTube URLs
  const mediaLinks = movie?.mediaLinks || [];

  // ⭐ Fix 1: Added null check for URL
  const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // ⭐ Shorts-a normal YouTube link-a maathura function (Player support-kaga)
  // ⭐ Fix 2: Safety check for Shorts
  const formatVideoUrl = (url) => {
    if (!url) return "";
    const id = getYouTubeID(url);
    if (url.includes("shorts") && id) {
      return `https://www.youtube.com/watch?v=${id}`;
    }
    return url;
  };

  const checkIfShorts = (url) => url?.includes("shorts");

  const getYTThumbnail = (url) => {
    const id = getYouTubeID(url);
    return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : "";
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          arrows: false,
          centerMode: true,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          arrows: false,
          centerMode: true,
          centerPadding: "15px",
        },
      },
    ],
  };

  const nextVideo = (e) => {
    e.stopPropagation();
    if (selectedIdx < mediaLinks.length - 1) setSelectedIdx(selectedIdx + 1);
  };

  const prevVideo = (e) => {
    e.stopPropagation();
    if (selectedIdx > 0) setSelectedIdx(selectedIdx - 1);
  };

  const currentRawUrl = selectedIdx !== null ? mediaLinks[selectedIdx] : null;
  const isShortsVideo = checkIfShorts(currentRawUrl);
  const playUrl = formatVideoUrl(currentRawUrl);

  return (
    <div className="text-white py-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="flex items-center gap-2 group cursor-pointer">
          <h2 className="text-2xl md:text-3xl font-black flex items-center uppercase tracking-wider">
            Reviews & Clips
            <ChevronRight
              className="ml-2 group-hover:text-orange-500 transition-colors"
              size={28}
            />
          </h2>
          <span className="text-gray-500 font-normal text-xl">
            ({mediaLinks.length})
          </span>
        </div>
      </div>

      {mediaLinks.length > 0 ? (
        <div className="slick-left-align relative px-2">
          <Slider {...settings}>
            {mediaLinks.map((url, index) => (
              <div key={index} className="px-2 focus:outline-none">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedIdx(index)}
                  className="relative overflow-hidden rounded-2xl cursor-pointer group bg-[#111] border-2 border-dotted border-white/5 hover:border-orange-500 transition-all duration-500 shadow-2xl aspect-video"
                >
                  {/* Thumbnail */}
                  <img
                    src={getYTThumbnail(url)}
                    alt={`Review ${index + 1}`}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Play Overlay - Trailer Style */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-full scale-90 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                      <Play size={20} fill="currentColor" className="ml-1" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] px-2 py-0.5 rounded text-white font-bold">
                    {checkIfShorts(url) ? "Shorts" : "Review"}
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        /* ⭐ No Videos Message Section */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 flex flex-col items-center justify-center py-16 px-4 rounded-2xl border-2 border-dotted border-white/5 bg-zinc-900/30"
        >
          <VideoOff size={48} className="text-zinc-700 mb-3" />
          <h3 className="text-xl font-bold text-zinc-500 uppercase tracking-widest">
            No Videos Available
          </h3>
          <p className="text-sm text-zinc-600 text-center mt-1">
            Video reviews for this movie will be updated soon.
          </p>
        </motion.div>
      )}

      {/* ⭐ Video Modal (LightBox Style) */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedIdx(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-6 right-6 z-[1010] bg-white/10 hover:bg-orange-500 p-2 rounded-full transition-all text-white"
            >
              <X size={28} />
            </button>

            {/* Nav Arrows (Desktop) */}
            <div className="hidden md:flex absolute inset-x-8 justify-between z-[1005] pointer-events-none">
              <button
                disabled={selectedIdx === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedIdx > 0) setSelectedIdx(selectedIdx - 1);
                }}
                className={`rounded-full  text-white hidden md:hidden lg:block hover:text-white/80 transition-all pointer-events-auto ${selectedIdx === 0 ? "opacity-20" : ""}`}
              >
                <ChevronLeft size={40} />
              </button>
              <button
                disabled={selectedIdx === mediaLinks.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedIdx < mediaLinks.length - 1)
                    setSelectedIdx(selectedIdx + 1);
                }}
                className={` rounded-full
                  
                    text-white hover:text-white/80 hidden md:hidden lg:block transition-all pointer-events-auto ${selectedIdx === mediaLinks.length - 1 ? "hidden" : ""}`}
              >
                <ChevronRight size={40} />
              </button>
            </div>

            {/* Video Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              key={selectedIdx}
              // className={`relative bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl
              //   ${isShortsVideo ? "w-full max-w-[380px] aspect-[9/16]" : "w-full max-w-5xl aspect-video"}
              //   max-h-[80vh]`}
              className="relative max-h-[450px] w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <VideoPlayer
                key={playUrl} // URL maarum pothu player re-render aaga
                videoOptions={{
                  autoplay: true,
                  controls: true,
                  fluid: true,
                  techOrder: ["youtube"],
                  sources: [{ src: playUrl, type: "video/youtube" }],
                }}
                onVideoEnd={() => {
                  if (selectedIdx < mediaLinks.length - 1)
                    setSelectedIdx((prev) => prev + 1);
                }}
              />

              {/* Info Bar inside Modal */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent p-6 pt-12">
                <h3 className="text-white font-bold text-lg">
                  Clip {selectedIdx + 1} of {mediaLinks.length}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieGallery;
