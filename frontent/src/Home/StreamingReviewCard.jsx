import React from "react";
import { FaCalendarAlt, FaFilm } from "react-icons/fa";

const StreamingReviewCard = ({ review }) => {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-xl overflow-hidden flex items-center p-2 gap-3 border-dashed border border-gray-800 hover:border-orange-400/60 transition-all duration-300 group cursor-pointer w-full shadow-sm">
      {/* 1. Left Section: Image & Release Date Below */}
      <div className="flex flex-col items-center flex-shrink-0 gap-1.5">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
          <img
            src={review.bannerImage}
            alt={review.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        {/* Release Date below Image */}
        {review.releaseDate && (
          <div className="mt-2 bg-[#1a1e26] px-2 py-1 rounded text-[9px] text-gray-500 font-bold uppercase whitespace-nowrap group-hover:text-white transition-colors">
            {review.releaseDate}
          </div>
        )}
      </div>

      {/* 2. Right Section: Movie Details */}
      <div className="flex-1 min-w-0 pr-1">
        <h3 className="text-white text-base font-black truncate leading-tight mb-1 group-hover:text-orange-400 transition-colors">
          {review.title || "N/A"}
        </h3>

        <div className="text-[11px] space-y-0.5">
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

          {/* Genres - Added below Cast */}
          <div className="flex">
            <span
              className="text-gray-400 font-medium truncate"
              title={review.cast}
            >
              Genres :{" "}
              <span className="text-gray-300">{review.genres || "N/A"}</span>
            </span>
          </div>
          <div className="flex">
            <span
              className="text-gray-400 font-medium truncate"
              title={review.cast}
            >
              Ratings :{" "}
              <span className="text-gray-300">{review.ratings || "N/A"}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingReviewCard;
