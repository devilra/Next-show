import React from "react";
import Slider from "react-slick";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaAngleRight } from "react-icons/fa";

// ⭐ New Release Movies Data
const NEW_RELEASE_MOVIES = [
  { id: 1, title: "Love Today", imageUrl: "/newrelease/l.avif" },
  { id: 2, title: "Dude", imageUrl: "/newrelease/d.jpg" },
  { id: 3, title: "Thalaivan Thalaivii", imageUrl: "/newrelease/t.webp" },
  { id: 4, title: "Aaryan", imageUrl: "/newrelease/a.jpg" },
  { id: 5, title: "Madharaasi", imageUrl: "/newrelease/m.jpg" },
  { id: 6, title: "Bison Kaalamaadan", imageUrl: "/newrelease/b.jpg" },
  { id: 7, title: "Shakthi Thirumagan", imageUrl: "/newrelease/s.jpg" },
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

// ⭐ Movie Card
const MovieCard = ({ movie }) => (
  <div className="p-2 cursor-pointer transition duration-300 hover:scale-[1.03] rounded-lg overflow-hidden">
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
  </div>
);

// ⭐ MAIN COMPONENT
const NewReleaseMoviesCarousel = ({ newReleases }) => {
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
    <div className="bg-[#0f0f0f] pt-10 px-0  md:px-8">
      {/* 🎬 Section Title */}
      <div className="flex justify-between items-center px-3 md:px-0 mb-6">
        <h2 className="text-white text-xl md:text-3xl font-bold">New Movies</h2>
        <span className="text-gray-400 flex items-center gap-2 hover:text-white cursor-pointer">
          View All <FaAngleRight />
        </span>
      </div>

      {/*lg,md Slider */}
      <div className="slick-left-align hidden md:block relative">
        <Slider {...settings}>
          {newReleases.map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </Slider>
      </div>

      {/* mobile Slider */}
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

export default NewReleaseMoviesCarousel;
