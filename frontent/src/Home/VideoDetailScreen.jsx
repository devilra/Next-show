import React, { useState, useEffect, useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const videoPlaylist = [
  {
    title: "Jananayagan Teaser",
    year: 2025,
    duration: "1m 45s",
    rating: "U/A 16+",
    languages: "Tamil",
    description:
      "A gripping political-action teaser showcasing the rise of an unexpected leader. Filled with tense moments, fiery dialogues, and powerful visuals.",
    genres: ["Action", "Political Thriller", "Drama"],
    src: "/video/jn.mp4",
  },
  {
    title: "Coolie Trailer",
    year: 2025,
    duration: "3m 2s",
    rating: "U/A 16+",
    languages: "Tamil • Telugu • Hindi • Kannada • Malayalam",
    description:
      "Rajinikanth teams up with Lokesh Kanagaraj in a high-voltage mass-action entertainer. The fiery announcement video showcases Thalaivar in a stylish, intense avatar with explosive BGM by Anirudh.",
    genres: ["Action", "Mass", "Thriller"],
    src: "/video/coolie.mp4", // Update to your actual file (local or external)
  },

  {
    title: "Jailer Teaser",
    year: 2023,
    duration: "1m 30s",
    rating: "U/A 16+",
    languages: "Tamil",
    description:
      "Rajinikanth returns in a powerful avatar with thrilling visuals.",
    genres: ["Thriller", "Mass", "Crime"],
    src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
];

export default function VideoDetailScreen() {
  const previewVideoRef = useRef(null);
  const fullVideoRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWatchingFull, setIsWatchingFull] = useState(false);

  const currentVideo = videoPlaylist[currentIndex];

  // Autoplay preview
  useEffect(() => {
    if (!isWatchingFull) {
      const video = previewVideoRef.current;
      if (video) {
        video.muted = true;
        video.play().catch(() => {});
      }
    }
  }, [currentIndex, isWatchingFull]);

  // Auto Next Video
  const handlePreviewEnd = () => {
    setCurrentIndex((prev) => (prev + 1 < videoPlaylist.length ? prev + 1 : 0));
  };

  // Manual NEXT
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1 < videoPlaylist.length ? prev + 1 : 0));
  };

  // Manual PREVIOUS
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? videoPlaylist.length - 1 : prev - 1
    );
  };

  // Watch Now
  const handleWatchNow = () => {
    setIsWatchingFull(true);
    setTimeout(() => {
      if (fullVideoRef.current) {
        fullVideoRef.current.muted = false;
        fullVideoRef.current.play().catch(() => {});
      }
    }, 200);
  };

  // Exit Full Video
  const handleExitFullVideo = () => {
    if (fullVideoRef.current) {
      fullVideoRef.current.pause();
      fullVideoRef.current.currentTime = 0;
    }
    setIsWatchingFull(false);
  };

  return (
    <div className="relative h-screen text-white">
      {/* ⭐ PREVIEW MODE */}
      {!isWatchingFull && (
        <>
          <video
            ref={previewVideoRef}
            src={currentVideo.src}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={handlePreviewEnd}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

          {/* ⭐ PREV BUTTON */}
          <button
            onClick={handlePrev}
            className="absolute left-5 top-1/2 -translate-y-1/2 
            bg-black/30 hover:bg-black/50 text-white 
            p-3 rounded-full text-4xl z-30"
          >
            <HiChevronLeft />
          </button>

          {/* ⭐ NEXT BUTTON */}
          <button
            onClick={handleNext}
            className="absolute right-5 top-1/2 -translate-y-1/2 
            bg-black/30 hover:bg-black/50 text-white 
            p-3 rounded-full text-4xl z-30"
          >
            <HiChevronRight />
          </button>

          {/* ⭐ TEXT CONTENT */}
          <div
            className="
            relative z-20 flex flex-col justify-center 
            h-screen px-6 md:px-16 max-w-2xl pt-[90px]
          "
          >
            <h1 className="text-6xl text-orange-400 font-bold mb-4">
              {currentVideo.title}
            </h1>

            <p className="text-xl text-slate-100 mb-4">
              {currentVideo.year} • {currentVideo.rating} •{" "}
              {currentVideo.duration} • {currentVideo.languages}
            </p>

            <p className="text-lg mb-4">{currentVideo.description}</p>

            <div className="mb-8">
              {currentVideo.genres.map((genre) => (
                <span key={genre} className="mr-4 text-gray-300">
                  {genre}
                </span>
              ))}
            </div>

            <button
              onClick={handleWatchNow}
              className="bg-red-600 text-white text-lg md:text-xl rounded-lg py-3 w-[200px] md:w-[240px]
              shadow-xl hover:bg-red-700 transition"
            >
              Watch Now
            </button>
          </div>
        </>
      )}

      {/* ⭐ FULL VIDEO PLAYER */}
      {isWatchingFull && (
        <div className="absolute inset-0 bg-black flex flex-col">
          <button
            onClick={handleExitFullVideo}
            className="absolute top-5 left-5 z-50 bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-lg backdrop-blur-md"
          >
            ⬅ Back to Home
          </button>

          <video
            ref={fullVideoRef}
            src={currentVideo.src}
            className="w-full h-full object-contain"
            controls
            autoPlay
          />
        </div>
      )}
    </div>
  );
}
