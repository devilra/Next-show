import React from "react";
import { FaCalendarAlt, FaFilm, FaStar } from "react-icons/fa";
import { MdOutlineLiveTv } from "react-icons/md";
import { Link } from "react-router-dom";

const StreamingReviewCard = ({ review }) => {
  // console.log("Review", review);

  // ✅ 1. YouTube Thumbnail Generator Function
  const getYouTubeThumbnail = (url) => {
    if (!url) return "https://via.placeholder.com/480x360?text=No+Trailer";
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\b\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
      : "https://via.placeholder.com/480x360?text=Invalid+URL";
  };

  // ✅ 2. Determine which image to show
  // trailerUrl iruntha athoda thumbnail edukkum, illana bannerImage-ai fallback-ah vachukkum
  const displayImage = review.trailerUrl
    ? getYouTubeThumbnail(review.trailerUrl)
    : review.bannerImage;

  // ✅ 2. Genre Formatting Logic
  // Array-ah iruntha comma pottu join pannum, string-ah iruntha apdiye kaattum
  const formattedGenres = Array.isArray(review.genres)
    ? review.genres.join(", ")
    : review.genres;

  return (
    <Link
      to={`/movie/${review.slug}`}
      className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-xl overflow-hidden flex items-center p-2 gap-3 border-dashed border border-gray-800 hover:border-orange-400/60 transition-all duration-300 group cursor-pointer w-full shadow-sm"
    >
      {/* 1. Left Section: Image with Absolute Date Overlay */}
      <div className="flex-shrink-0">
        <div className="relative w-28 h-28 rounded-lg overflow-hidden group">
          <img
            src={displayImage}
            alt={review.title}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />

          {/* ⭐ Rating Sticker - Image-ku mela top right corner-la irukkum */}
          {/* <div className="absolute -top-1 -right-1  backdrop-blur-md  gap-0.5 flex items-center bg-black px-1.5 py-0.5 rounded border border-gray-800 flex-shrink-0">
            <FaStar className="text-orange-400 text-[10px] " />
            <span className="text-white text-[12px] ml-0.5">4.5</span>
          </div> */}

          {/* 🔥 Date Overlay (Absolute positioning inside relative parent) */}
          {review.ottReleaseDate && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-1 flex justify-center items-center backdrop-blur-[1px]">
              <span className="text-white text-[10px] font-bold uppercase whitespace-nowrap tracking-wider">
                {review.ottReleaseDate}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Right Section: Movie Details */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-white text-base font-black max-w-[150px] truncate leading-tight mb-1 group-hover:text-orange-400 transition-colors">
            {review.title || "N/A"}
          </h3>
          {/* Static Rating Section */}
          <div className="flex items-center bg-black/40 px-1.5 py-0.5 rounded border border-gray-800 flex-shrink-0">
            <FaStar className="text-orange-400 text-[10px] mr-1" />
            <span className="text-white text-[12px] font-bold">8.5</span>
            {/* <span className="text-white/50 text-[12px] ml-0.5">/5</span> */}
          </div>
        </div>

        <div className="text-[11px] space-y-0.5 mt-2">
          {/* Director */}
          <div className="flex">
            <span className="text-gray-400 font-medium truncate">
              Director :{" "}
              <span className="text-gray-300">{review.director || "N/A"}</span>
            </span>
          </div>

          {/* Cast */}
          <div className="flex">
            <span
              className="text-gray-400 font-medium truncate"
              title={review.cast}
            >
              Cast :{" "}
              <span className="text-gray-300">{review.cast || "N/A"}</span>
            </span>
          </div>

          {/* Genres */}
          {/* ✅ Genres with MdOutlineLiveTv Icon */}
          <div className="flex  gap-1.5 mt-1">
            <div
              className="flex items-center justify-between w-full text-gray-400 font-medium truncate"
              title={review.genres}
            >
              <div className="flex items-center">
                <span>Genres : </span>
                <span className="text-gray-300 ml-1">
                  {formattedGenres || "N/A"}
                </span>
              </div>
              <div title="Streaming">
                <MdOutlineLiveTv
                  size={18}
                  className="text-orange-400 text-[13px] mr-1 flex-shrink-0"
                />
              </div>
            </div>
          </div>

          {/* Ratings */}
          {/* <div className="flex">
            <span
              className="text-gray-400 font-medium truncate"
              title={review.ratings}
            >
              Ratings :{" "}
              <span className="text-gray-300">{review.ratings || "N/A"}</span>
            </span>
          </div> */}
        </div>
      </div>
    </Link>
  );
};

export default StreamingReviewCard;
