import React, { useState, useEffect, useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Slider from "react-slick";
import { Link } from "react-router-dom";

// Slick CSS imports
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaAngleRight } from "react-icons/fa";

const videoPlaylist = [
  {
    id: 1,
    movieName: "Jana Nayagan",
    title: "Jana Nayagan  Joseph Vijay  H. Vinoth",
    description:
      "Jana Nayagan ('People's Hero') is an upcoming Indian Tamil-language action thriller...",
    src: "/video/jn.mp4", // Video available
    thumbnail: "/thumbnail/jana.jpg",
    date: "JAN 9, 2026",
  },
  {
    id: 2,
    movieName: "Madharasi",
    title: "Madharasi Movie News starring Sivakarthikeyan",
    description:
      "Madharaasi (2025) is an AR Murugadoss-directed Tamil action thriller starring Sivakarthikeyan as Raghu, a man with mental issues who develops superpowers from trauma, fighting a gang importing guns into Tamil Nadu, with themes of love healing him and confronting gun culture, featuring strong action, Anirudh's music, and a compelling performance from Sivakarthikeyan as a vigilante hero. ",
    src: "/video/madarasi-trailer.mp4", // No video (Button hidden)
    thumbnail: "/thumbnail/madara.jpg",
    date: "FEB 15, 2025",
  },
  {
    id: 3,
    movieName: "Sardar 2",
    title: "Sardar 2 Movie News from Nextshow",
    description:
      "Sardar 2 is a high-stakes Tamil spy-action sequel to the 2022 hit, directed by P.S. Mithran, with Karthi reprising his role as the secret agent, taking on a massive threat known as 1Black Dagger1 (played by S.J. Suryah) in a bigger, more intense political thriller with new additions like Malavika Mohanan and Ashika Ranganath, promising global espionage and action when it releases in late 2025. ",
    src: "/video/sardar-2.mp4",
    thumbnail: "/thumbnail/sardar-2.jpg",
    date: "JUN 7, 2025",
  },
  {
    id: 4,
    movieName: "Test (2025)",
    title: "Test (2025)",
    description:
      "Test (2025) is a Tamil hyperlink sports drama about three individuals whose lives intertwine around an India-Pakistan cricket match",
    src: "/video/test.mp4",
    thumbnail: "/thumbnail/test.jpg",
    date: "APR 4, 2025",
  },
  {
    id: 5,
    movieName: "Thanal (2025)",
    title: "Test (2025)",
    description: " ",
    src: "/video/thanal.mp4",
    thumbnail: "/thumbnail/thanal.jpg",
    date: "SEP 12, 2025",
  },
];

export default function VideoDetailScreen({ activeVideos, activeBlogs }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWatchingFull, setIsWatchingFull] = useState(false);
  const videoRef = useRef(null);
  const fullVideoRef = useRef(null);
  const sliderRef = useRef(null);
  const currentVideo = activeVideos[currentIndex];

  // Auto-play preview video when index changes
  useEffect(() => {
    if (!isWatchingFull && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(currentIndex);
    }
  }, [currentIndex, isWatchingFull, currentVideo, activeVideos.length]);

  // Handle Watch Now Action
  const handleWatchNow = () => {
    setIsWatchingFull(true);
    // Give a small timeout for the DOM to render the fullVideo element
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

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    // responsive: [
    //   { breakpoint: 1024, settings: { slidesToShow: 3 } },
    //   { breakpoint: 600, settings: { slidesToShow: 2 } },
    // ],
  };

  // ஒருவேளை டேட்டா இன்னும் வரவில்லை என்றால்
  // if (!activeVideos || activeVideos.length === 0) {
  //   return (
  //     <div className="h-screen bg-[#0a0d14] flex items-center justify-center text-white">
  //       No active banners found.
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0d14] text-white overflow-hidden mt-20 md:mt-0 ">
      {/* FULL VIDEO PLAYER OVERLAY */}
      {isWatchingFull && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <button
            onClick={handleExitFullVideo}
            className="absolute top-5 left-5 z-[110] bg-white/20 hover:bg-white/40 text-white px-6 py-2 rounded-lg backdrop-blur-md transition"
          >
            ← Back
          </button>
          <video
            ref={fullVideoRef}
            src={currentVideo?.videoUrl}
            className="w-full h-full object-contain"
            controls
            autoPlay
          />
        </div>
      )}

      {/* LEFT SIDE: MAIN PLAYER & CAROUSEL */}
      <div className="w-full md:w-[70%] flex flex-col relative border-r border-gray-800">
        <div className="relative flex-1 bg-black group overflow-hidden">
          {/* Preview Video */}
          <video
            ref={videoRef}
            src={currentVideo?.videoUrl}
            className="w-full h-full object-cover"
            muted
            playsInline
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-transparent"></div>

          {/* Navigation Controls */}
          <button
            onClick={() =>
              setCurrentIndex((prev) =>
                prev > 0 ? prev - 1 : activeVideos.length - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 p-3 rounded-full hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <HiChevronLeft size={30} />
          </button>

          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % activeVideos.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 p-3 rounded-full hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <HiChevronRight size={30} />
          </button>

          {/* Title and Action Button */}
          <div className="absolute bottom-10 left-10 hidden md:block z-20">
            <h2 className="text-4xl font-bold drop-shadow-2xl text-white tracking-tighter mb-4">
              {currentVideo?.title}
            </h2>

            {/* Conditional Rendering for Watch Now Button */}
            {currentVideo?.videoUrl ? (
              <button
                onClick={handleWatchNow}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-10 rounded-md transition transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <span>Watch Now</span>
              </button>
            ) : (
              <p className="text-gray-400 italic">No Video Available</p>
            )}
          </div>
        </div>

        {/* BOTTOM: THUMBNAIL CAROUSEL */}
        <div className="h-36 bg-[#0f121a] p-4 border-t border-gray-800">
          <Slider ref={sliderRef} {...settings}>
            {activeVideos.map((item, index) => (
              <div key={item.id} className="px-2 outline-none">
                <div
                  onClick={() => setCurrentIndex(index)}
                  className={`relative cursor-pointer transition-all duration-300 rounded-md overflow-hidden border-2 h-24 ${
                    currentIndex === index
                      ? "border-[#f98603] scale-95 shadow-lg"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={item.bannerImage}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* RIGHT SIDE: NEWS LIST */}
      <div className="w-full md:w-[30%] bg-[#0d1017] flex flex-col border-l mt-20 border-gray-800">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-gray-400 uppercase text-xs font-bold tracking-[0.2em]">
            News
          </h3>

          <Link
            to="/news"
            className="text-gray-400 uppercase text-xs font-bold tracking-[0.2em] flex items-center gap-2 hover:text-white cursor-pointer"
          >
            View All <FaAngleRight />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-8">
          {activeBlogs.map((movie) => (
            <div
              key={movie.id}
              className="flex gap-4 group transition-all duration-300 border-b border-white/5 pb-4 last:border-0 cursor-pointer"
            >
              <div className="flex-1">
                <h4 className="text-[15px] font-semibold text-white/70 group-hover:text-blue-400 leading-tight mb-2 transition-colors">
                  {movie.title}
                </h4>
                <p className="text-gray-500 text-[11px] line-clamp-2 leading-relaxed font-light">
                  {movie.shortDescription}
                </p>
              </div>

              <div className="flex flex-col items-center shrink-0">
                <div className="w-20 h-14 rounded overflow-hidden shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img
                    src={movie.bannerImage}
                    alt=""
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform"
                  />
                </div>
                <div className="mt-2 bg-[#1a1e26] px-2 py-1 rounded text-[9px] text-gray-500 font-bold uppercase whitespace-nowrap group-hover:text-white transition-colors">
                  {/* {movie.date.split(",")[0]} */}
                  {movie.newsDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
