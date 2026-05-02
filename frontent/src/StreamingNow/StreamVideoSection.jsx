import React, { useState, useEffect, useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Slider from "react-slick";

// Slick CSS imports
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const videoPlaylist = [
  {
    title: "Jananayagan Teaser",
    year: 2025,
    duration: "1m 45s",
    rating: "U/A 16+",
    languages: "Tamil • Telugu • Hindi • Kannada • Malayalam",
    description:
      "A gripping political-action teaser showcasing the rise of an unexpected leader.",
    genres: ["Action", "Political Thriller"],
    src: "/video/jn.mp4",
    thumbnail: "https://via.placeholder.com/200x120?text=Jananayagan",
  },
  {
    title: "Coolie Trailer",
    year: 2025,
    duration: "3m 2s",
    rating: "U/A 16+",
    languages: "Tamil • Telugu • Hindi • Kannada • Malayalam",
    description:
      "Rajinikanth teams up with Lokesh Kanagaraj in a high-voltage entertainer.",
    genres: ["Action", "Mass"],
    src: "/video/coolie.mp4",
    thumbnail: "https://via.placeholder.com/200x120?text=Coolie",
  },
  {
    title: "Jailer Teaser",
    year: 2023,
    duration: "1m 30s",
    rating: "U/A 16+",
    languages: "Tamil • Telugu • Hindi • Kannada • Malayalam",
    description: "Rajinikanth returns in a powerful avatar.",
    genres: ["Thriller", "Mass"],
    src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnail: "https://via.placeholder.com/200x120?text=Jailer",
  },
];

export default function StreamVideoSection({ activeItems }) {
  const previewVideoRef = useRef(null);
  const fullVideoRef = useRef(null);
  const sliderRef = useRef(null); // ⭐ Carousel control panna ref

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWatchingFull, setIsWatchingFull] = useState(false);
  const [showText, setShowText] = useState(true);

  const currentVideo = activeItems[currentIndex];

  // ⭐ Index maarum pothu Carousel sync panna
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(currentIndex);
    }

    if (!isWatchingFull && previewVideoRef.current) {
      previewVideoRef.current.load();
      previewVideoRef.current.play().catch(() => {});
    }

    setShowText(true);
    const timer = setTimeout(() => setShowText(false), 7000);
    return () => clearTimeout(timer);
  }, [currentIndex, isWatchingFull]);

  const showTextTemporarily = () => {
    setShowText(true);
    setTimeout(() => setShowText(false), 5000);
  };

  // ⭐ Next Video Logic (Reuse panna common function)
  const goToNextVideo = () => {
    setCurrentIndex((prev) => (prev + 1 < videoPlaylist.length ? prev + 1 : 0));
    showTextTemporarily();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? videoPlaylist.length - 1 : prev - 1
    );
    showTextTemporarily();
  };

  const handleWatchNow = () => {
    setIsWatchingFull(true);
    setTimeout(() => {
      if (fullVideoRef.current) {
        fullVideoRef.current.muted = false;
        fullVideoRef.current.play().catch(() => {});
      }
    }, 200);
  };

  const handleExitFullVideo = () => {
    setIsWatchingFull(false);
  };

  // Carousel settings
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="relative h-screen bg-[#0a0d14] text-white overflow-hidden">
      {!isWatchingFull && (
        <>
          {/* Main Preview Video */}
          <video
            ref={previewVideoRef}
            src={currentVideo?.videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            onEnded={goToNextVideo}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-transparent"></div>

          {/* Controls - (Left/Right arrows are always visible for easy navigation) */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 p-3 rounded-full z-30"
          >
            <HiChevronLeft size={40} />
          </button>
          <button
            onClick={goToNextVideo}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 p-3 rounded-full z-30"
          >
            <HiChevronRight size={40} />
          </button>

          {/* Text & Button Container */}
          <div className="relative z-20 flex flex-col justify-center pt-40 h-screen px-6 md:px-16 max-w-2xl">
            {/* 1. Intha area mattum 7s-la hide aagum */}
            <div
              className={`transition-opacity duration-1000 ${
                showText ? "opacity-100" : "opacity-0 invisible"
              }`}
            >
              <h1 className="text-4xl md:text-6xl text-orange-400 font-bold mb-4">
                {currentVideo?.title}
              </h1>
              {/* <p className="text-md mb-6">{currentVideo.longDescription}</p> */}
            </div>

            {/* 2. Watch Now Button - Ithu eppovumae theriyum (Always Visible) */}
            {currentVideo?.videoUrl && (
              <button
                onClick={handleWatchNow}
                className=" w-[200px] py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-lg border border-red-500/50"
              >
                Watch Now
              </button>
            )}
          </div>
        </>
      )}

      {/* Full Player Mode */}
      {isWatchingFull && (
        <div className="absolute inset-0 bg-black z-[100] flex flex-col">
          <button
            onClick={handleExitFullVideo}
            className="absolute top-5 left-5 z-[110] bg-white/20 px-4 py-2 rounded-lg"
          >
            ← Back
          </button>
          <video
            ref={fullVideoRef}
            src={currentVideo?.videoUrl}
            className="w-full h-full object-contain"
            controls
            onEnded={handleExitFullVideo}
          />
        </div>
      )}
    </div>
  );
}
