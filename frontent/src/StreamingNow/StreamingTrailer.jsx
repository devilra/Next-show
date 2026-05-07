import React, { useState } from "react";
import Slider from "react-slick";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import {
  FaPlay,
  FaPlus,
  FaStar,
  FaClock,
  FaGlobe,
  FaFilm,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────
// YOUTUBE THUMBNAIL HELPER
// ─────────────────────────────────────────────────────────
const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  const match = url.match(
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\b\?v=|\&v=)([^#\&\?]*).*/,
  );
  return match && match[2].length === 11
    ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
    : null;
};

// ─────────────────────────────────────────────────────────
// ARROWS
// ─────────────────────────────────────────────────────────
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20
               w-11 h-11 items-center justify-center rounded-full
               transition-all duration-200"
    style={{
      background: "rgba(255,255,255,0.08)",
      border: "0.5px solid rgba(255,255,255,0.18)",
      backdropFilter: "blur(10px)",
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.background = "rgba(249,115,22,0.25)")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
    }
  >
    <HiChevronRight className="text-white text-2xl" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20
               w-11 h-11 items-center justify-center rounded-full
               transition-all duration-200"
    style={{
      background: "rgba(255,255,255,0.08)",
      border: "0.5px solid rgba(255,255,255,0.18)",
      backdropFilter: "blur(10px)",
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.background = "rgba(249,115,22,0.25)")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
    }
  >
    <HiChevronLeft className="text-white text-2xl" />
  </button>
);

// ─────────────────────────────────────────────────────────
// MOVIE CARD
// ─────────────────────────────────────────────────────────
const MovieCard = ({ movie }) => {
  const [hovered, setHovered] = useState(false);

  const displayImage =
    movie.bannerImage || getYouTubeThumbnail(movie.trailerUrl);

  // REAL DATA FROM YOUR RESPONSE
  const releaseYear = movie.ottReleaseDate
    ? movie.ottReleaseDate.split(" ").pop()
    : "";
  const duration = movie.durationOrSeason || "N/A";
  const genres = movie.genres || [];
  const rating = movie.imdbRating || "0";
  const ottDate = movie.ottReleaseDate || "TBA";
  const castList = typeof movie.cast === "string" ? movie.cast.split(", ") : [];

  return (
    <Link
      to={`/movie/${movie.slug}`}
      className="block p-3 outline-none" // Width konjam increase panna p-3
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden w-full max-w-[400px]" // Card width increased
        style={{
          borderRadius: 24,
          height: 320, // Height increased to match width
          transition:
            "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          // boxShadow: hovered
          //   ? "0 30px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(249,115,22,0.3)"
          //   : "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        {/* ── POSTER IMAGE ── */}
        <img
          src={displayImage}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            transition: "transform 0.8s ease, filter 0.5s ease",
            transform: hovered ? "scale(1.15)" : "scale(1)",
            filter: hovered ? "brightness(0.4) blur(1px)" : "brightness(0.9)",
          }}
        />

        {/* ── MULTI-LAYER SHADOW (Neenga keta step shadow) ── */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `linear-gradient(to top, 
              rgba(0,0,0,1) 0%,         /* 1. Deep Black Bottom */
              rgba(0,0,0,0.8) 15%,      /* 2. Dark Black */
              rgba(0,0,0,0.5) 35%,      /* 3. Mid Black */
              rgba(0,0,0,0.2) 60%,      /* 4. Light Black */
              transparent 100%)` /* 5. Clear Top */,
            opacity: hovered ? 1 : 0.85,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* ── THEATRE RELEASE BADGE (New Release Style) ── */}
        {/* {movie.ottReleaseDate && (
          <div className="absolute top-4 left-4 z-10">
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px]  text-white uppercase tracking-wider"
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              In Streaming
            </span>
          </div>
        )} */}

        {/* ── BOTTOM INFO (Hides on hover) ── */}
        <div
          className="absolute -bottom-4 left-0 right-0 z-10 px-5 pb-6 transition-all duration-300"
          style={{
            opacity: hovered ? 0 : 1,
            transform: hovered ? "translateY(10px)" : "translateY(0)",
          }}
        >
          <h3 className="text-white  text-[30px] md:text-[32px] lg:text-[33px] truncate leading-tight mb-2 drop-shadow-lg">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap text-[11px]  text-white/60">
            <span>{ottDate}</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>{duration}</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span className="">{movie.certification || "U/A"}</span>
          </div>
        </div>

        {/* ── HOVER OVERLAY DETAILS (Real data only) ── */}
        <div
          className="absolute inset-0 z-20 flex flex-col justify-end px-5 pb-6 transition-all duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {/* IMDB Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <FaStar className="text-yellow-500 text-[12px]" />
            <span className="text-white text-[13px]">{rating}</span>
            <span className="text-white/30 text-[10px]">/ 10</span>
          </div>

          <h3 className="text-white text-[24px] leading-tight mb-2">
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {genres.map((g) => (
              <span
                key={g}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/10 text-white/80 border border-white/10"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Release & Duration */}
          <div className="flex items-center gap-4 mb-4 text-[11px] text-white/50 ">
            <span className="flex items-center text-white/60 gap-1.5">
              <FaClock className="text-white/60" /> {duration}
            </span>
            <span className="flex items-center gap-1.5 text-white/60">
              {ottDate}
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

          {/* CTA */}
          {/* 🎬 Plot / Description */}
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

// ─────────────────────────────────────────────────────────
// MAIN CAROUSEL COMPONENT
// ─────────────────────────────────────────────────────────
const StreamingTrailer = ({ newReleases, trendingStream = [] }) => {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
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
    arrows: false,
  };

  // if (!newMovies || newMovies.length === 0) return null;

  return (
    <div className="bg-[#0f0f0f] pb-5 pt-1 px-0 md:px-4">
      {/* Desktop / Tablet */}
      {trendingStream && trendingStream.length > 0 ? (
        <>
          {" "}
          <div className="slick-left-align hidden md:hidden lg:block relative">
            <Slider {...settings}>
              {trendingStream.map((movie) => (
                <div key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </Slider>
          </div>
          {/* Mobile */}
          <div className="lg:hidden  slick-left-align  relative">
            <Slider {...mobileSettings}>
              {trendingStream.map((movie) => (
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
          <p className="text-slate-100 text-xl md:text-2xl font-bold  mb-2">
            No trending movies available
          </p>
          {/* <p className="max-w-lg text-slate-400">
                  This section is being refreshed with the latest movies. Come back
                  later for new arrivals.
                </p> */}
        </div>
      )}

      <style>{`
        .slick-slide { padding: 0 4px; }
        .slick-center > div > a > div {
          transform: scale(1.04) !important;
          box-shadow: 0 24px 64px rgba(0,0,0,0.7) !important;
        }
      `}</style>
    </div>
  );
};

export default StreamingTrailer;
