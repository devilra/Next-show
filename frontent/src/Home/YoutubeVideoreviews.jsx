import React, { useState } from "react";
import VideoPlayer from "../Components/VideoPlayer";
import { FaPlay, FaRegThumbsUp, FaRegClock, FaEye } from "react-icons/fa"; // Icons-kaga sethukonga
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const youtubeReviews = [
  {
    id: 1,
    movieName: "Jana Nayagan",
    title: "Jana Nayagan - First Roar Glimpse Public Review | Thalapathy Vijay",
    channelName: "Madurai bro",
    reviewer: "Public Review",
    language: "Tamil",
    duration: "0:23",
    views: "46K views",
    postedTime: "2 weeks ago",
    likes: "2.7K",
    rating: "4.8",
    videoOptions: {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      techOrder: ["youtube"],
      sources: [
        {
          src: "https://youtube.com/shorts/aVjpADMuylE?si=J5ULxftBoU5Ya5T4",
          type: "video/youtube",
        },
      ],
    },
  },
  {
    id: 2,
    movieName: "Coolie",
    title: "Coolie - Official Teaser | Rajinikanth | Lokesh Kanagaraj",
    channelName: "Bingoo Box",
    reviewer: "Official Review",
    language: "Tamil",
    duration: "3:53",
    views: "310M views",
    postedTime: "5 months ago",
    likes: "3.4M",
    rating: "3.9",
    videoOptions: {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      techOrder: ["youtube"],
      sources: [
        {
          src: "https://youtu.be/rRtPAHBi0vo?si=BO-khVrBPcz3nNsn",
          type: "video/youtube",
        },
      ],
    },
  },
  {
    id: 3,
    movieName: "idli kadai",
    title: "idli kadai - Review | Dhanush | Arun Vijay",
    channelName: "Bingoo Box",
    reviewer: "Official Review",
    language: "Tamil",
    duration: "1:08",
    views: "195k views",
    postedTime: "2 months ago",
    likes: "9.2k",
    rating: "3.9",
    videoOptions: {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      techOrder: ["youtube"],
      sources: [
        {
          src: "https://youtube.com/shorts/ygjJvQmJMQo?si=nAga0j02jyNTQ8f0",
          type: "video/youtube",
        },
      ],
    },
  },
];

// ⭐ Arrows Reusable
const NextArrow = ({ className, style, onClick }) => (
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
    `}
      style={{ ...style, display: "flex" }}
      onClick={onClick}
    >
      <HiChevronRight className="text-white text-3xl drop-shadow-xl" />
    </div>
  </div>
);

const PrevArrow = ({ className, style, onClick }) => (
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
    `}
      style={{ ...style, display: "flex" }}
      onClick={onClick}
    >
      <HiChevronLeft className="text-white text-3xl drop-shadow-xl" />
    </div>
  </div>
);

export default function YoutubeVideoReviews() {
  const [activeTab, setActiveTab] = useState("Tamil");
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const languages = ["Tamil", "English", "Hindi", "Telugu"];

  const filteredReviews = youtubeReviews.filter(
    (review) => review.language === activeTab
  );

  const getYouTubeID = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleNextVideo = (currentId) => {
    const currentIndex = filteredReviews.findIndex((r) => r.id === currentId);
    if (currentIndex !== -1 && currentIndex + 1 < filteredReviews.length) {
      setSelectedVideoId(filteredReviews[currentIndex + 1].id);
    } else {
      setSelectedVideoId(null);
    }
  };

  const getFormatLink = (options) => {
    let sourceLink = options.sources[0].src;
    if (sourceLink.includes("shorts/")) {
      sourceLink = sourceLink.replace("shorts/", "watch?v=");
    } else if (sourceLink.includes("youtu.be/")) {
      sourceLink = sourceLink.replace("youtu.be/", "youtube.com/watch?v=");
    }
    return {
      ...options,
      sources: [{ ...options.sources[0], src: sourceLink }],
    };
  };

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 5,
    speed: 500,
    dots: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, centerPadding: "40px" },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, centerPadding: "50px", arrows: false },
      },
    ],
  };

  return (
    <div className="p-6 md:p-16 text-white border-t border-gray-800 ">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="text-red-600">YouTube</span> Latest Movie Reviews
      </h2>

      {/* Language Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => {
              setActiveTab(lang);
              setSelectedVideoId(null);
            }}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 border ${
              activeTab === lang
                ? "bg-red-600 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                : "bg-transparent border-gray-700 hover:border-gray-500"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredReviews.map((review) => {
          const videoId = getYouTubeID(review.videoOptions.sources[0].src);
          const autoThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

          return (
            <div
              key={review.id}
              className="group flex flex-col bg-[#161921] rounded-2xl overflow-hidden border border-gray-800 hover:border-red-600/50 transition-all shadow-xl"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                {selectedVideoId === review.id ? (
                  <VideoPlayer
                    videoOptions={getFormatLink(review.videoOptions)}
                    onVideoEnd={() => handleNextVideo(review.id)}
                  />
                ) : (
                  <div
                    className="relative w-full h-full cursor-pointer flex items-center justify-center"
                    onClick={() => setSelectedVideoId(review.id)}
                  >
                    <img
                      src={autoThumbnail}
                      alt={review.movieName}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                    />

                    <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] px-1.5 py-0.5 rounded font-bold">
                      {review.duration}
                    </span>

                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                      <div className="bg-red-600 p-3 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                        <FaPlay className="text-white text-xl" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
                    {review.channelName}
                  </span>
                  <span className="text-yellow-500 text-xs font-bold">
                    ⭐ {review.rating}
                  </span>
                </div>

                <h3 className="text-md font-bold leading-snug mb-3 line-clamp-2  transition-colors">
                  {review.title}
                </h3>

                {/* Meta Info Footer */}
                <div className="mt-auto pt-3 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FaEye size={12} /> {review.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaRegThumbsUp size={11} /> {review.likes}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <FaRegClock size={11} /> {review.postedTime}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReviews.length === 0 && (
        <p className="text-gray-500 text-center py-10">
          No reviews found for this language.
        </p>
      )}
    </div>
  );
}
