import React, { useState } from "react";
import Slider from "react-slick";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { ChevronRight, X, ChevronLeft, ImageOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ⭐ Arrows Reusable
const NextArrow = ({ className, style, onClick }) => {
  const isDisabled = className?.includes("slick-disabled");
  return (
    <div className="hidden md:hidden lg:block">
      <div
        className={`
      ${className}  !right-[-25px] !z-20 !w-12 !h-12 
      flex items-center justify-center 
      rounded-full 
      bg-gradient-to-br from-[#ffffff25] to-[#00000055]
      border border-white/20 
      backdrop-blur-md
      hover:from-[#ffffff40] hover:to-[#00000080]
      transition-all duration-300 cursor-pointer shadow-lg
      ${isDisabled ? "opacity-0 pointer-events-none" : "opacity-100"}
    `}
        style={{ ...style, display: "flex" }}
        onClick={onClick}
      >
        <HiChevronRight className="text-white text-3xl drop-shadow-xl" />
      </div>
    </div>
  );
};

const PrevArrow = ({ className, style, onClick }) => {
  const isDisabled = className.includes("slick-disabled");
  return (
    <div className="hidden md:hidden lg:block">
      <div
        className={`
      ${className} !left-[-25px] !z-20 !w-12 !h-12 
      flex items-center justify-center 
      rounded-full 
      bg-gradient-to-br from-[#ffffff25] to-[#00000055]
      border border-white/20 
      backdrop-blur-md
      hover:from-[#ffffff40] hover:to-[#00000080]
      transition-all duration-300 cursor-pointer shadow-lg
      ${isDisabled ? "opacity-0 pointer-events-none" : "opacity-100"}
    `}
        style={{ ...style, display: "flex" }}
        onClick={onClick}
      >
        <HiChevronLeft className="text-white text-3xl drop-shadow-xl" />
      </div>
    </div>
  );
};

const MovieGallery = ({ movie }) => {
  // 1. Unga backend response-la irunthu galleryLinks-ah edukkurom
  // Inga data illana empty array [] default-ah vachikurom

  const [selectedIdx, setSelectedIdx] = useState(null); // ID-ku bathila Index vachikalam for easy navigation
  const galleryLinks = movie?.galleryLinks || [];

  // Dynamic Video/Photo IDs
  const videoIds = [
    "zdu0YzzJ10o",
    "zdu0YzzJ10o",
    "zdu0YzzJ10o",
    "zdu0YzzJ10o",
    "zdu0YzzJ10o",
    "zdu0YzzJ10o",
    "zdu0YzzJ10o",
    "zdu0YzzJ10o",
  ];

  const getYTThumbnail = (id) =>
    `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
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
          slidesToShow: 1.5, // Mobile-la konjam next photo theriya
          arrows: false,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
  };

  // Modal navigation functions
  const nextImage = (e) => {
    e.stopPropagation();
    if (selectedIdx < galleryLinks.length - 1) setSelectedIdx(selectedIdx + 1);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (selectedIdx > 0) setSelectedIdx(selectedIdx - 1);
  };

  // // Gallery-la images illana section-ah hide pannidalam
  // if (galleryLinks.length === 0) return null;

  return (
    <div className="py-8 bg-[#0f0f0f] text-white">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="flex items-center gap-2 group cursor-pointer">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center">
            Photos
            <ChevronRight
              className="ml-2 group-hover:text-yellow-500 transition-colors"
              size={28}
            />
          </h2>
          <span className="text-gray-500 font-normal text-xl">
            ({galleryLinks.length})
          </span>
        </div>
      </div>

      {galleryLinks.length > 0 ? (
        <>
          {/* Carousel Section - Ellame images-ah mattum kaatum */}
          <div className=" slick-left-align hidden md:block relative px-2 md:px-1">
            <Slider {...settings}>
              {galleryLinks.map((id, index) => (
                <div key={index} className="px-2 focus:outline-none">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedIdx(index)}
                    className="relative overflow-hidden rounded-xl cursor-pointer group bg-zinc-900 border border-white/5 shadow-md aspect-[4/3]"
                  >
                    <img
                      src={getYTThumbnail(id)}
                      alt={`Gallery item ${index + 1}`}
                      className="w-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />

                    {/* Hover Effect Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>

          {/* mobile Slider */}

          <div className=" slick-left-align md:hidden relative px-2 md:px-1">
            <Slider {...settings}>
              {galleryLinks.map((id, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedIdx(index)}
                  className="relative overflow-hidden rounded-xl cursor-pointer group bg-zinc-900 border border-white/5 shadow-md aspect-[4/3]"
                >
                  <div className="relative overflow-hidden rounded-xl cursor-pointer group bg-zinc-900 border border-white/5 shadow-md">
                    <img
                      src={getYTThumbnail(id)}
                      alt={`Gallery item ${index + 1}`}
                      className="w-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />

                    {/* Hover Effect Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </Slider>
          </div>
        </> /* ⭐ No Photos Message Section */
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-white/5 bg-zinc-900/50"
        >
          <ImageOff size={48} className="text-zinc-600 mb-3" />
          <h3 className="text-lg font-medium text-zinc-400">
            No Photos Available
          </h3>
          <p className="text-sm text-zinc-500 text-center mt-1">
            Gallery for this movie will be updated soon.
          </p>
        </motion.div>
      )}

      {/* 2. ⭐ Separate Modal (Lightbox) with its own Navigation */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 z-[1000] cursor-pointer"
              onClick={() => setSelectedIdx(null)}
            >
              <X size={28} />
            </motion.button>

            {/* Modal Navigation - Left Arrow */}
            {selectedIdx > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-4 md:left-8 p-3 z-[1000] rounded-full bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                <ChevronLeft size={36} />
              </button>
            )}

            {/* Modal Navigation - Right Arrow */}
            {selectedIdx < galleryLinks.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 md:right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all z-[1000]"
              >
                <ChevronRight size={36} />
              </button>
            )}

            {/* Enlarged Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              key={selectedIdx} // Key change pannuna dhaan image transition aagum
              className="relative max-w-5xl  w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 "
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getYTThumbnail(galleryLinks[selectedIdx])}
                className="w-full h-full object-cover"
                alt="Enlarged"
              />
              {/* Image Counter in Modal */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1 rounded-full text-xs text-gray-300">
                {selectedIdx + 1} / {galleryLinks.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieGallery;
