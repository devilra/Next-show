// src/sections/ReviewCard.js
import React from "react";

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl overflow-hidden flex items-center p-3 gap-4 border border-gray-800 hover:border-red-600/50 transition-all duration-300 group cursor-pointer h-full shadow-2xl">
      {/* 1. Small Movie Image Section */}
      <div className="relative w-1/3 aspect-[3/4] flex-shrink-0 rounded-xl overflow-hidden shadow-md">
        <img
          src={review.img}
          alt={review.movie}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Type Badge (Optional: like 'Upcoming' or 'New') */}
        <div className="absolute top-2 left-2 text-[#f98603] bg-black/70 text-[9px] font-black px-2 py-0.5 rounded shadow-md uppercase tracking-tighter">
          {review.streamType}
        </div>
      </div>

      {/* 2. Movie Details Section (Right Side) */}
      <div className="flex-1 pr-2">
        {/* Movie Title */}
        <h3 className="text-white text-xl md:text-2xl font-bold mb-2 leading-tight">
          {review.movie}
        </h3>

        {/* Director */}
        <div className="flex items-start gap-2 mb-1">
          <span className="text-white/60 font-bold text-sm md:text-md min-w-[70px]">
            Director :
          </span>
          <span className="text-white text-sm md:text-md font-medium">
            {review.director}
          </span>
        </div>

        {/* Cast */}
        <div className="flex items-center gap-2 mb-1 min-w-0">
          <span className="text-white/60 font-bold text-sm md:text-md min-w-[70px] flex-shrink-0">
            Cast :
          </span>
          <span
            className="text-white text-sm md:text-md font-medium truncate block"
            title={review.cast}
          >
            {review.cast}
          </span>
        </div>

        {/* Released Date */}
        <div className="flex items-start gap-2">
          <span className="text-white/60 font-bold text-sm md:text-md min-w-[70px]">
            Released :
          </span>
          <span className="text-white text-sm md:text-md font-medium">
            {review.year}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
