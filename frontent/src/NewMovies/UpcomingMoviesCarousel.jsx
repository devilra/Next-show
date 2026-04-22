import React from "react";
import Slider from "react-slick";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

// ⭐ YouTube Thumbnail Generator Function (Same as your ReviewCard)
const getYouTubeThumbnail = (url) => {
  if (!url) return "https://via.placeholder.com/480x360?text=No+Trailer";
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\b\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
    : "https://via.placeholder.com/480x360?text=Invalid+URL";
};

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
const MovieCard = ({ movie }) => {
  // ✅ Trailer URL iruntha thumbnail edukkum, illana bannerImage fallback
  const displayImage = movie.trailerUrl
    ? getYouTubeThumbnail(movie.trailerUrl)
    : movie.bannerImage;

  return (
    <Link
      to={`/movie/${movie.slug}`}
      className="p-2 block cursor-pointer transition duration-300 hover:scale-[1.03] rounded-lg overflow-hidden"
    >
      <div className="bg-[#1a1a1a] rounded-lg shadow-lg">
        <img
          src={displayImage}
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
};

// 5. Main Carousel Component
const UpcomingMoviesCarousel = ({ upcomingMovies, upcomming }) => {
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
        <h2 className="text-white text-xl md:text-3xl font-bold">
          Upcoming Movies
        </h2>

        <span className="text-gray-400 flex items-center gap-2 hover:text-white cursor-pointer">
          View All <FaAngleRight />
        </span>
      </div>

      {/* lg,md Slider */}
      <div className=" hidden md:block  slick-left-align">
        <Slider {...settings}>
          {upcomming.map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </Slider>
      </div>

      {/* mobile view Slider */}
      <div className="slick-left-align md:hidden relative">
        <Slider {...settings} slidesToShow={1}>
          {upcomming.map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default UpcomingMoviesCarousel;
