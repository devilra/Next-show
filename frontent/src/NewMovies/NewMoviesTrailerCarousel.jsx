import React, { useState } from "react";
import Slider from "react-slick";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaStar, FaClock, FaFilm } from "react-icons/fa";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────
// YOUTUBE THUMBNAIL
// ─────────────────────────────────────────────
const getYouTubeThumbnail = (url) => {
  if (!url) return null;

  const match = url.match(
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\b\?v=|\&v=)([^#\&\?]*).*/,
  );

  return match && match[2].length === 11
    ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
    : null;
};

// ─────────────────────────────────────────────
// ARROWS
// ─────────────────────────────────────────────
const NextArrow = ({ onClick, currentSlide, slideCount }) => {
  const isDisabled = currentSlide >= slideCount - 3;
  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20
               w-11 h-11 items-center justify-center rounded-full   ${
                 isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
               }`}
      style={{
        background: isDisabled
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.08)",
        border: "0.5px solid rgba(255,255,255,0.18)",
        backdropFilter: "blur(10px)",
      }}
    >
      <HiChevronRight className="text-white text-2xl" />
    </button>
  );
};

const PrevArrow = ({ onClick, currentSlide }) => {
  const isDisabled = currentSlide === 0;
  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20
               w-11 h-11 items-center justify-center rounded-full ${
                 isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
               }`}
      style={{
        background: isDisabled
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.08)",
        border: "0.5px solid rgba(255,255,255,0.18)",
        backdropFilter: "blur(10px)",
      }}
    >
      <HiChevronLeft className="text-white text-2xl" />
    </button>
  );
};

// ─────────────────────────────────────────────
// MOVIE CARD
// ─────────────────────────────────────────────
const MovieCard = ({ movie }) => {
  const [hovered, setHovered] = useState(false);

  const displayImage =
    movie.bannerImage || getYouTubeThumbnail(movie.trailerUrl);

  const genres = movie.genres || [];

  const rating = movie.imdbRating || "0";

  const duration = movie.durationOrSeason || "N/A";

  const theatreDate = movie.theatreReleaseDate || "TBA";

  const castList =
    typeof movie.cast === "string" ? movie.cast.split(", ") : movie.cast || [];

  return (
    <Link
      to={`/movie/${movie.slug}`}
      className="block p-3 outline-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden w-full max-w-[400px]"
        style={{
          borderRadius: 24,
          height: 320,
          transition:
            "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease",
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}
      >
        {/* IMAGE */}
        <img
          src={displayImage}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            transition: "transform 0.7s ease, filter 0.4s ease",
            transform: hovered ? "scale(1.12)" : "scale(1)",
            filter: hovered ? "brightness(0.42)" : "brightness(0.82)",
          }}
        />

        {/* MULTI SHADOW */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to top,
                rgba(0,0,0,1) 0%,
                rgba(0,0,0,0.88) 18%,
                rgba(0,0,0,0.65) 36%,
                rgba(0,0,0,0.3) 58%,
                rgba(0,0,0,0.08) 82%,
                transparent 100%
              )
            `,
          }}
        />

        {/* DEFAULT INFO */}
        <div
          className="absolute -bottom-4 left-0 right-0 z-20 px-5 pb-6 transition-all duration-300"
          style={{
            opacity: hovered ? 0 : 1,
            transform: hovered ? "translateY(10px)" : "translateY(0)",
          }}
        >
          <h3 className="text-white text-[30px] md:text-[32px] lg:text-[33px] truncate leading-tight mb-2 drop-shadow-lg">
            {movie.title}
          </h3>

          <div className="flex items-center gap-2 flex-wrap text-[11px] text-white/60">
            <span>{theatreDate}</span>

            <span className="w-1 h-1 rounded-full bg-white/20"></span>

            <span>{duration}</span>

            <span className="w-1 h-1 rounded-full bg-white/20"></span>

            <span>{movie.certification || "U/A"}</span>
          </div>
        </div>

        {/* HOVER DETAILS */}
        <div
          className="absolute inset-0 z-30 flex flex-col justify-end px-5 pb-6 transition-all duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(18px)",
          }}
        >
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <FaStar className="text-yellow-500 text-[12px]" />

            <span className="text-white text-[13px]">{rating}</span>

            <span className="text-white/30 text-[10px]">/10</span>
          </div>

          {/* Title */}
          <h2 className="text-white text-[24px] leading-tight mb-3">
            {movie.title}
          </h2>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.map((genre) => (
              <span
                key={genre}
                className="px-2.5 py-1 rounded-lg text-[10px] text-white/75 border border-white/10"
                style={{
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-4 text-[11px] text-white/50">
            <span className="flex items-center text-white/60 gap-1.5">
              <FaClock />
              {duration}
            </span>

            <span className="flex items-center gap-1.5 text-white/60">
              {theatreDate}
            </span>
          </div>

          {/* Cast */}
          {castList.length > 0 && (
            <p className="text-[11px] leading-relaxed text-white/95 mb-3 line-clamp-2">
              <span className="text-white/90 font-bold">Cast : </span>

              {castList.slice(0, 4).map((actor, index) => (
                <span key={actor}>
                  {actor}

                  {index !== castList.slice(0, 4).length - 1 && (
                    <span className="mx-1 text-white/40">•</span>
                  )}
                </span>
              ))}

              {castList.length > 4 && "..."}
            </p>
          )}

          {/* Description */}
          {movie.longDescription && (
            <p
              className="text-[11px] leading-[1.7] text-white/50 line-clamp-2"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {movie.longDescription.length > 120
                ? `${movie.longDescription.slice(0, 120)}...`
                : movie.longDescription}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const NewMoviesTrailerCarousel = ({ trendingMovies = [] }) => {
  const settings = {
    className: "center",
    centerMode: false,
    infinite: false,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    dots: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3, centerPadding: "40px" },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, centerPadding: "30px" },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, centerPadding: "40px", arrows: false },
      },
    ],
  };

  const mobileSettings = {
    ...settings,
    slidesToShow: 1,
    centerPadding: "48px",
    centerMode: false,
    arrows: false,
  };

  return (
    <div className="bg-[#0f0f0f] pb-5 pt-1 px-0 md:px-4">
      {trendingMovies && trendingMovies.length > 0 ? (
        <>
          {/* Desktop */}
          <div className="hidden md:block slick-left-align relative">
            <Slider {...settings}>
              {trendingMovies.map((movie) => (
                <div key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </Slider>
          </div>

          {/* Mobile */}
          <div className="md:hidden slick-left-align relative">
            <Slider {...mobileSettings}>
              {trendingMovies.map((movie) => (
                <div key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </Slider>
          </div>
        </>
      ) : (
        <div className="flex min-h-[350px] m-9 flex-col items-center justify-center rounded-[24px] bg-gradient-to-br from-[#1e1e1f] via-[#212123] to-[#252525] px-8 py-12 text-center border border-white/10 shadow-xl shadow-black/40">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 border border-white/10">
            <FaFilm className="text-3xl text-slate-200 opacity-90" />
          </div>
          <p className="text-slate-100 text-xl md:text-2xl font-bold mb-2">
            No trending movies available
          </p>
        </div>
      )}

      <style>{`
        .slick-slide {
          padding: 0 6px;
        }
      `}</style>
    </div>
  );
};

export default NewMoviesTrailerCarousel;
