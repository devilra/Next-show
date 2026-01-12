import React from "react";
import Slider from "react-slick";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

// 1. Sample Data (Mock)
const UPCOMING_MOVIES = [
  // 2025-ல் அதிகம் எதிர்பார்க்கப்படும் அல்லது வெளியாகும் படங்கள்
  { id: 1, title: "Jana Nayagan", imageUrl: "/upcomming/j.jpg" }, // Vijay's final film announcement
  { id: 2, title: "Vidaa Muyarchi", imageUrl: "/upcomming/v.jpg" }, // Ajith's highly anticipated film
  { id: 3, title: "Vettaiyan", imageUrl: "/upcomming/vettaiyan.jpg" }, // Rajinikanth's 2025 release
  {
    id: 4,
    title: "The Greatest of All Time (GOAT)",
    imageUrl: "/upcomming/goat.jpg",
  }, // Major sci-fi project
  { id: 5, title: "Indian 2", imageUrl: "/upcomming/i.jpeg" }, // Conclusion of the sequel
  { id: 7, title: "Captain Miller 2", imageUrl: "/upcomming/c.jpg" }, // Sequel to the 2024 hit
  { id: 8, title: "Thug Life", imageUrl: "/upcomming/t.jpg" }, // Kamal Haasan's gangster saga

  // மற்ற முக்கியப் படங்கள்
  { id: 9, title: "Ayalaan 2", imageUrl: "/upcomming/a.jpg" },
  { id: 10, title: "Maanavan", imageUrl: "/upcomming/m.jpg" },
  { id: 11, title: "Yaanai", imageUrl: "/upcomming/t.jpg" },
];

// ⭐ Custom Next Arrow (Highlighted Style)
const NextArrow = ({ className, style, onClick }) => {
  return (
    <div className="hidden md:hidden lg:block">
      <div
        className={`
        ${className} !right-[-25px] !z-20 !w-12 !h-12 
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
};

// ⭐ Custom Previous Arrow (Highlighted Style)
const PrevArrow = ({ className, style, onClick }) => {
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
      `}
        style={{ ...style, display: "flex" }}
        onClick={onClick}
      >
        <HiChevronLeft className="text-white text-3xl drop-shadow-xl" />
      </div>
    </div>
  );
};

// 4. Movie Card Component
const MovieCard = ({ movie }) => (
  <Link
    to={`/movie/${movie.slug}`}
    className="p-2 block cursor-pointer transition duration-300 hover:scale-[1.03] rounded-lg overflow-hidden"
  >
    <div className="bg-[#1a1a1a] rounded-lg shadow-lg">
      <img
        src={movie.bannerImage}
        alt={movie.title}
        className="w-full object-cover rounded-t-lg"
        style={{ height: "350px" }}
      />
      <div className="p-3 text-center">
        <h3 className="text-white text-md font-semibold truncate">
          {movie.title}
        </h3>
      </div>
    </div>
  </Link>
);

// 5. Main Carousel Component
const StreamingTrailer = ({ newReleases }) => {
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
        settings: {
          slidesToShow: 3,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerPadding: "50px",
          arrows: false, // mobile hide
        },
      },
    ],
  };

  return (
    <div className="bg-[#0f0f0f] pt-10 px-0 md:px-8">
      {/* Title Row */}
      <div className="flex justify-between items-center px-3 md:px-0 mb-6">
        <h2 className="text-white text-xl md:text-3xl font-bold">Trailers</h2>

        <span className="text-gray-400 flex items-center gap-2 hover:text-white cursor-pointer">
          View All <FaAngleRight />
        </span>
      </div>

      {/* lg,md Slider */}
      <div className="slick-left-align hidden md:block relative">
        <Slider {...settings}>
          {newReleases.map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </Slider>
      </div>

      {/* mobile view Slider */}
      <div className="slick-left-align md:hidden relative">
        <Slider {...settings} slidesToShow={1}>
          {newReleases.map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default StreamingTrailer;
