import React, { useState } from "react";
import { FaEye, FaPlay, FaRegClock } from "react-icons/fa";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Slider from "react-slick";
import VideoPlayer from "../Components/VideoPlayer";

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
    streamType: "TRENDING",
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
    streamType: "UPCOMMING",
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
  {
    id: 4,
    movie: "Thangalaan",
    title: "Thangalaan Trailer | Chiyaan Vikram | Pa Ranjith",
    streamType: "TRENDING",
    source: "User_Priya",
    img: "https://images.hindustantimes.com/img/2024/08/15/1600x900/Thangalaan_1723709197073_1723709197226.jpg",
    rating: 5.0,
    videoUrl: "https://youtu.be/9KUOQvF25NI?si=WJj6_drWequUif17",
    duration: "2:15",
    views: "18M views",
    postedTime: "3 months ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 5,
    movie: "Leo",
    title: "Leo - Bloody Sweet Promo | Thalapathy Vijay",
    streamType: "TRENDING",
    source: "Times",
    img: "https://resizing.flixster.com/-BOvYVtW6LKWOdfbFz12hVdYzGk=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2RlNzVkZjM0LWRiZmEtNGE0YS1hYTUyLTU1YzlhYjQwMzViZi5qcGc=",
    rating: 3.0,
    videoUrl: "https://youtu.be/Po3jStA673E?si=yz6mVL1TMZ4rrOQ3",
    duration: "3:05",
    views: "65M views",
    postedTime: "1 year ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 6,
    movie: "Ayalaan",
    title: "Ayalaan - Official Trailer | Sivakarthikeyan",
    streamType: "TRENDING",
    img: "https://sund-images.sunnxt.com/183332/640x360_Ayalaan_183332_cb824cdc-d392-4342-9671-ed5993e24106.jpg",
    source: "User_Karthi",
    rating: 4.2,
    videoUrl: "https://youtu.be/kNpwAxnjbNA?si=t_0yaZbTFfV8-Hls",
    duration: "2:20",
    views: "22M views",
    postedTime: "8 months ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 7,
    movie: "Indian 2",
    title: "Indian 2 - Comeback Indian | Kamal Haasan | Shankar",
    streamType: "TRENDING",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3NKYr7e-aJ4nWHWHIne16exZqYhy3vNFS8w&s",
    source: "Behindwoods",
    rating: 4.5,
    videoUrl: "https://youtu.be/3bvBUT5pQYY?si=_8Abvnl-Lse1_MgW",
    duration: "2:10",
    views: "40M views",
    postedTime: "5 months ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 8,
    movie: "Captain Miller",
    title: "Captain Miller Teaser | Dhanush | G.V. Prakash",
    streamType: "TRENDING",
    img: "https://m.media-amazon.com/images/M/MV5BNmMyNjlhY2UtN2QxNi00MWRiLWJjZDgtMzU1ZWM2NzZkNTQ1XkEyXkFqcGc@._V1_.jpg",
    source: "User_Deepa",
    rating: 4.0,
    videoUrl: "https://youtu.be/ujhWbKP1rKA?si=wz4cYsvk2bFNBpl2",
    duration: "1:50",
    views: "35M views",
    postedTime: "11 months ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 9,
    movie: "Viduthalai P1",
    title: "Viduthalai Part 1 Trailer | Vetrimaaran | Soori",
    streamType: "TRENDING",
    img: "https://img.airtel.tv/unsafe/fit-in/500x0/filters:format(webp)/https://xstreamcp-assets-msp.streamready.in/assets/ZEEFIVE/MOVIE/66ff656c56c0c1016282c99a/images/720x108079149533392f461ba75a664d5a95aa13.jpg?o=production",
    source: "India Today",
    rating: 4.0,
    videoUrl: "https://youtu.be/GYeSfq_bj_M?si=aISR8KsBRw2sp7kU",
    duration: "2:30",
    views: "15M views",
    postedTime: "1 year ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 10,
    movie: "Thunivu",
    title: "Thunivu Trailer | Ajith Kumar | H Vinoth",
    streamType: "NEW",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR09Ipl53al9eH4VyxgdeXFwmaZEElbJvopgA&s",
    source: "User_Manoj",
    rating: 3.8,
    videoUrl: "https://youtu.be/jnBZboK17_A?si=WGePgZiCf5YT6ESO",
    duration: "2:00",
    views: "55M views",
    postedTime: "1 year ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 11,
    movie: "Vaathi",
    title: "Vaathi Trailer | Dhanush | Samyuktha",
    streamType: "NEW",
    img: "https://m.media-amazon.com/images/M/MV5BODhmMTFmNjMtZjMwOS00MjNlLWJkNzQtYTI0MjhiZDMzNzZmXkEyXkFqcGc@._V1_.jpg",
    source: "Film Companion",
    rating: 3.0,
    videoUrl: "https://youtu.be/FOEtbqbwS50?si=W-5d40GgDy3wHJ97",
    duration: "1:55",
    views: "10M views",
    postedTime: "1 year ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 12,
    movie: "Sardar-2",
    title: "Sardar 2 - Announcement Video | Karthi",
    streamType: "UPCOMMING",
    img: "https://m.media-amazon.com/images/M/MV5BMmYxMmJkMDAtNzc4NC00MzliLWJiNmItMWIyNGI5OWIyM2Q4XkEyXkFqcGc@._V1_.jpg",
    source: "User_Shalini",
    rating: 4.1,
    videoUrl: "https://youtu.be/dXqOYGqLsdA?si=IcOyOZPk8nTRDfeP",
    duration: "1:20",
    views: "4M views",
    postedTime: "1 month ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 13,
    movie: "Pathu Thala",
    title: "Pathu Thala Trailer | Silambarasan TR | AR Rahman",
    streamType: "UPCOMMING",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJDrSW9f_JTZ6CDpi4FPxA64l_NyEwTLpCWA&s",
    source: "Galatta",
    rating: 3.5,
    videoUrl: "https://youtu.be/pnUUJY3HQZk?si=Yil_pM5ycGBNlIYf",
    duration: "2:10",
    views: "12M views",
    postedTime: "10 months ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 14,
    movie: "Maamannan",
    title: "Maamannan - Official Trailer | Udhayanidhi Stalin | Vadivelu",
    streamType: "UPCOMMING",
    img: "https://m.media-amazon.com/images/M/MV5BNjdhOTg4NzMtMTY2MC00YmY0LWJiMWMtMTJkYzIzMWFmNTJmXkEyXkFqcGc@._V1_.jpg",
    source: "User_Sanjay",
    rating: 4.8,
    videoUrl: "https://youtu.be/xWe03YByWEI?si=5ZewUf6QLOQxQjhc",
    duration: "2:25",
    views: "20M views",
    postedTime: "1 year ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 15,
    movie: "Ponniyin Selvan 2",
    title: "PS-2 Trailer | Mani Ratnam | AR Rahman",
    streamType: "TRENDING",
    img: "https://resizing.flixster.com/bykwdBFKjGapfGZZ9cLdQjQsEoQ=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzFiYjc4OGQzLWM3NWMtNDY4ZS1iOTYxLWY3Y2RlMGFmNjM3OC5qcGc=",
    source: "Vikatan",
    rating: 4.0,
    videoUrl: "https://youtu.be/EnhS3matIoU?si=YbHFZ92qvkim3PPX",
    duration: "3:15",
    views: "45M views",
    postedTime: "1 year ago",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
];

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

const TrailerHome = () => {
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const getYouTubeID = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Base Settings - CenterMode 'false' panniye left alignment varum
  const getSettings = (itemCount) => ({
    dots: false,
    // infinite: itemCount > 5, // 5 item-ku mela iruntha mattum infinite loop aagum
    speed: 500,

    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: false, // Ithu thaan left-la irunthu start panna vaikum
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: () => setSelectedVideoId(null),
    afterChange: () => {
      // safety cleanup
      const iframes = document.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        iframe.src = iframe.src;
      });
    },
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          infinite: itemCount > 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          infinite: itemCount > 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          infinite: itemCount > 2,
          arrows: false,
        },
      },
    ],
  });

  const renderSection = (title, type) => {
    const filtered = trailerData.filter((item) => item.streamType === type);
    if (filtered.length === 0) return null;

    // Ovvovoru section-kum filtered data count-ai anuppuvom
    const sectionSettings = getSettings(filtered.length);

    return (
      <div className="mb-12">
        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest border-l-4 rounded-sm border-orange-400 pl-3">
          {title}
        </h3>
        <div className="px-0 hidden md:hidden lg:block md:px-4 slick-left-align">
          <Slider {...sectionSettings} className="">
            {filtered.map((item) => {
              const videoId = getYouTubeID(item.videoUrl);
              const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

              return (
                <div key={item.id} className="px-3">
                  <div className="bg-[#111] rounded-xl overflow-hidden border border-gray-800 hover:border-red-600/50 transition-all group">
                    <div className="relative aspect-video bg-black overflow-hidden">
                      {selectedVideoId === item.id ? (
                        <VideoPlayer
                          key={item.id}
                          videoOptions={{
                            autoplay: true,
                            controls: true,
                            responsive: true,
                            fluid: true,
                            techOrder: ["youtube"],
                            sources: [
                              {
                                src: item.videoUrl,
                                type: "video/youtube",
                              },
                            ],
                          }}
                          onVideoEnd={() => setSelectedVideoId(null)}
                        />
                      ) : (
                        <div
                          className="relative w-full h-full cursor-pointer"
                          onClick={() => setSelectedVideoId(item.id)}
                        >
                          <img
                            src={thumbnail}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-600 p-3 rounded-full shadow-xl">
                              <FaPlay className="text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Content Area */}
                    {/* <div className="p-4">
                      <h4 className="font-bold text-sm line-clamp-1 text-white group-hover:text-red-500 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between mt-3 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaEye /> {item.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaRegClock /> {item.postedTime}
                        </span>
                      </div>
                    </div> */}
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
        <div className="px-0 md:block lg:hidden md:px-4 slick-left-align">
          <Slider {...sectionSettings} slidesToShow={2} className="">
            {filtered.map((item) => {
              const videoId = getYouTubeID(item.videoUrl);
              const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

              return (
                <div key={item.id} className="px-3">
                  <div className="bg-[#111] rounded-xl overflow-hidden border border-gray-800 hover:border-red-600/50 transition-all group">
                    <div className="relative aspect-video bg-black overflow-hidden">
                      {selectedVideoId === item.id ? (
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                          title={item.title}
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                      ) : (
                        <div
                          className="relative w-full h-full cursor-pointer"
                          onClick={() => setSelectedVideoId(item.id)}
                        >
                          <img
                            src={thumbnail}
                            alt={item.movieName}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-600 p-3 rounded-full shadow-xl transform group-hover:scale-110 transition-transform">
                              <FaPlay className="text-white" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] px-1.5 py-0.5 rounded font-bold">
                            {item.duration}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Content Area */}
                    {/* <div className="p-4">
                      <h4 className="font-bold text-sm line-clamp-1 text-white group-hover:text-red-500 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between mt-3 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaEye /> {item.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaRegClock /> {item.postedTime}
                        </span>
                      </div>
                    </div> */}
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0a0a0a] pt-10 px-4 md:px-8 min-h-screen text-white">
      <h2
        className="text-3xl font-bold text-gray-400 mb-10 border-b border-gray-800 pb-4"
        style={{ fontFamily: '"Audiowide", sans-serif' }}
      >
        TRAILER <span className="text-orange-400">ZONE</span>
      </h2>
      {renderSection("Upcoming", "UPCOMMING")}
      {renderSection("New Releases", "NEW")}
      {renderSection("Trending Now", "TRENDING")}
    </div>
  );
};

export default TrailerHome;
