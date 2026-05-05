import React, { useEffect, useState } from "react";
import { FaEye, FaPlay, FaRegClock, FaYoutube } from "react-icons/fa";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Slider from "react-slick";
import VideoPlayer from "../Components/VideoPlayer";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const trailerData = [
  {
    id: 1,
    movie: "Jailer",
    title: "Jailer - Official Showdown | Rajinikanth | Nelson",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
    streamType: "NEW",
    source: "The Hindu",
    img: "https://content.tupaki.com/en/feeds/2023/08/10/142196-jail.jpg",
    rating: 4.0,
    videoUrl: "https://youtu.be/Y5BeWdODPqo?si=rr51pMQD7xMeIqFb",
    duration: "2:45",
    views: "50M views",
    postedTime: "1 year ago",
  },
  {
    id: 2,
    movie: "Vettaiyan",
    title: "Vettaiyan - Official Teaser | Rajinikanth | Anirudh",
    streamType: "NEW",
    source: "User_Aravind",
    img: "https://m.media-amazon.com/images/S/pv-target-images/d92ce2f6c69640edfde56eeba4bcb8868b7aabe5ba7313b721f8a5425c810716._SX1080_FMjpg_.jpg",
    rating: 4.5,
    videoUrl: "https://youtu.be/zPqMbwmGC1U?si=AfwDNLh3z8w8CeYl",
    duration: "1:30",
    views: "12M views",
    postedTime: "2 months ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 3,
    movie: "Jana Nayagan",
    title: "Jana Nayagan - Glimpse | Thalapathy Vijay",
    streamType: "NEW",
    source: "DT Next",
    img: "https://i.pinimg.com/736x/1c/09/6c/1c096c1b143ae5f4499e90081b15cf51.jpg",
    rating: 3.5,
    videoUrl: "https://youtu.be/MKUDHKf_pkg?si=GlphErJ2rl4ylNqJ",
    duration: "0:55",
    views: "5M views",
    postedTime: "2 weeks ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
];

const VideoInfo = ({
  videoUrl,
  views,
  postedTime,
  movieName,
  director,
  cast,
  genre,
}) => {
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(
          `https://www.youtube.com/oembed?url=${videoUrl}&format=json`,
        );
        setMeta(res.data);
      } catch (err) {
        console.error("Oembed Error:", err);
      }
    };
    fetchDetails();
  }, [videoUrl]);

  return (
    <div className="p-4 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
      {/* Movie Name & Video Title */}
      <h4 className="font-bold text-[13px] line-clamp-1 text-white group-hover:text-orange-400 transition-colors  tracking-[1px]">
        {movieName}
      </h4>

      {/* Details Section */}
      <div className="text-[11px] space-y-0.5 mb-3">
        {/* Director */}
        <div className="flex">
          <span className="text-gray-400 font-medium truncate">
            Director :{" "}
            <span className="text-gray-300">{director || "N/A"}</span>
          </span>
        </div>

        {/* Cast */}
        <div className="flex">
          <span className="text-gray-400 font-medium truncate" title={cast}>
            Cast : <span className="text-gray-300">{cast || "N/A"}</span>
          </span>
        </div>
        {/* Genres */}
        <div className="flex">
          <span className="text-gray-400 font-medium truncate">
            Genres : <span className="text-gray-300">{genre || "N/A"}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const NextArrow = ({ className, style, onClick }) => (
  <div className="hidden md:hidden lg:block">
    <div
      className={`
      ${className}  !right-[-20px] !z-20 !w-12 !h-12 
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
      ${className} !left-[-20px] !z-20 !w-12 !h-12 
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

const NewTrailers = ({ activeTrailers }) => {
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  console.log("Active Trailers", activeTrailers);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // 🔥 Mobile browser fix – force after load
    setTimeout(() => {
      setViewportWidth(window.innerWidth);
    }, 300);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getYouTubeID = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Base Settings - CenterMode 'false' panniye left alignment varum
  const getSettings = (itemCount) => {
    const slidesToShow = 5;

    // Video count slidesToShow-vida kammiya iruntha arrows show panna koodathu
    const showArrows = itemCount > slidesToShow;
    return {
      dots: false,
      // infinite: itemCount > 5, // 5 item-ku mela iruntha mattum infinite loop aagum
      speed: 500,
      infinite: false,
      slidesToShow: 5,
      slidesToScroll: 1,
      centerMode: false,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      beforeChange: (current, next) => {
        setActiveVideoId(null); // Slide aagum pothu ethavathu video play aagittu iruntha atha thumbnail-ukku mathidum
      },
      responsive: [
        {
          breakpoint: 1280,
          settings: { slidesToShow: 6 },
        },
        {
          breakpoint: 1024,
          settings: { slidesToShow: 3 },
        },
        {
          breakpoint: 768, // Tablet
          settings: { slidesToShow: 2, arrows: true },
        },
        {
          breakpoint: 480, // Mobile
          settings: { slidesToShow: 1.3, arrows: false, dots: true },
        },
      ],
    };
  };

  const renderSection = (title, type) => {
    const filtered = trailerData.filter((item) => item.streamType === type);
    if (filtered.length === 0) return null;

    // Ovvovoru section-kum filtered data count-ai anuppuvom
    const sectionSettings = getSettings(filtered.length);

    return (
      <div className="bg-[#0a0a0a]   overflow-hidden">
        <div className="hidden md:block lg:block">
          <Slider {...sectionSettings}>
            {activeTrailers.map((item) => {
              const videoId = getYouTubeID(item.trailerUrl);
              const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

              return (
                <div key={item.id} className="px-2 pb-4">
                  <div
                    onClick={() => setSelectedTrailer(item)}
                    className="relative bg-[#111] rounded-2xl cursor-pointer overflow-hidden border-2 border-dotted border-white/5 hover:border-orange-400 transition-all duration-500 group shadow-2xl"
                  >
                    {/* 🔥 Movie Name Badge (Card-க்கு மேலேயே காட்டும்) */}
                    {/* <div className="absolute top-3 left-3 z-10">
                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider backdrop-blur-sm">
                      {item.movieName}
                    </span>
                  </div> */}

                    {/* Video/Thumbnail Section */}
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={thumbnail}
                        alt={item.movieName}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-full scale-90 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                          <FaPlay className="ml-1" />
                        </div>
                      </div>

                      <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] px-2 py-0.5 rounded text-white font-bold">
                        {item.videoLength || "2:30"}
                      </div>
                    </div>

                    {/* Info Section */}
                    <VideoInfo
                      videoUrl={item.trailerUrl}
                      views={item.views}
                      postedTime={item.postedTimeDisplay}
                      movieName={item.movieName}
                    />
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>

        {/* Mobile device only carosel */}

        <div className="md:hidden">
          <Slider {...sectionSettings} slidesToShow={2}>
            {activeTrailers.map((item) => {
              const videoId = getYouTubeID(item.trailerUrl);
              const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

              return (
                <div key={item.id} className="px-2 pb-4">
                  <div
                    onClick={() => setSelectedTrailer(item)}
                    className="relative bg-[#111] rounded-2xl cursor-pointer overflow-hidden border-2 border-dotted border-white/5 hover:border-orange-400 transition-all duration-500 group shadow-2xl"
                  >
                    {/* 🔥 Movie Name Badge (Card-க்கு மேலேயே காட்டும்) */}
                    {/* <div className="absolute top-3 left-3 z-10">
                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider backdrop-blur-sm">
                      {item.movieName}
                    </span>
                  </div> */}

                    {/* Video/Thumbnail Section */}
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={thumbnail}
                        alt={item.movieName}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-full scale-90 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                          <FaPlay className="ml-1" />
                        </div>
                      </div>

                      <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] px-2 py-0.5 rounded text-white font-bold">
                        {item.videoLength || "2:30"}
                      </div>
                    </div>

                    {/* Info Section */}
                    <VideoInfo
                      videoUrl={item.trailerUrl}
                      views={item.views}
                      postedTime={item.postedTimeDisplay}
                      movieName={item.movieName}
                    />
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>

        {/* 🔥 --- VIDEO MODAL (CENTER POPUP) --- 🔥 */}
        <AnimatePresence>
          {selectedTrailer && (
            <>
              {/* Backdrop: Click panna video stop aagum */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTrailer(null)}
                className="fixed inset-0 bg-black/10 backdrop-blur-md z-[100] flex items-center justify-center p-4"
              >
                {/* Modal Content */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 20 }}
                  onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing when clicking inside
                  className="relative w-full max-w-2xl bg-[#111] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedTrailer(null)}
                    className="absolute top-4 right-4 z-[110] bg-white/10 hover:bg-orange-500 p-2 rounded-full transition-all text-white shadow-lg"
                  >
                    <X size={20} />
                  </button>
                  {/* Video Player Container */}
                  <div className="aspect-video w-full bg-black">
                    <VideoPlayer
                      videoOptions={{
                        autoplay: true,
                        controls: true,
                        fluid: true,
                        techOrder: ["youtube"],
                        sources: [
                          {
                            src: selectedTrailer.trailerUrl,
                            type: "video/youtube",
                          },
                        ],
                      }}
                      onVideoEnd={() => setSelectedTrailer(null)}
                    />
                  </div>

                  {/* Video Details inside Modal */}
                  <div className="p-6 bg-[#111]">
                    <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                      {selectedTrailer.movieName} -{" "}
                      <span className="text-orange-500 font-medium text-sm capitalize">
                        Official Trailer
                      </span>
                    </h3>
                    {/* <div className="flex gap-4 text-xs text-gray-400">
                      <p>
                        Director:{" "}
                        <span className="text-gray-200">
                          {selectedTrailer.director}
                        </span>
                      </p>
                      <p>
                        Cast:{" "}
                        <span className="text-gray-200">
                          {selectedTrailer.cast}
                        </span>
                      </p>
                    </div> */}
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="bg-[#0a0a0a] pt-10 px-4 md:px-8  text-white">
      <h2 className="text-white text-xl mb-3 font-black uppercase tracking-wider">
        New Trailers
      </h2>
      {/* {renderSection("Upcoming", "UPCOMMING")} */}
      {renderSection("New Releases", "NEW")}
      {/* {renderSection("Trending Now", "TRENDING")} */}
    </div>
  );
};

export default NewTrailers;
