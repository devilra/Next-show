import React from "react";

const StreamingReviewCard = ({ review }) => {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-xl overflow-hidden flex items-center p-2 gap-3 border-dashed border border-gray-800 hover:border-orange-400/60 transition-all duration-300 group group cursor-pointer w-full shadow-sm">
      {/* 1. Small Square Movie Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={review.img}
          alt={review.movie}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Trending Badge Overlay */}
        {/* {review.streamType === "TRENDING" && (
          <div className="absolute top-1 left-1 bg-black/80 text-[7px] text-white px-1 rounded font-bold uppercase">
            Trending
          </div>
        )} */}
      </div>

      {/* 2. Movie Details Section */}
      <div className="flex-1 min-w-0 pr-1">
        <h3 className="text-white text-base font-black truncate leading-tight mb-1">
          {review.movie}
        </h3>

        <div className="text-[11px] space-y-0.5">
          <div className="flex">
            <span className="text-gray-500 font-bold w-14">Director :</span>
            <span className="text-gray-400 font-medium truncate">
              {review.director}
            </span>
          </div>

          <div className="flex">
            <span className="text-gray-500 font-bold w-14">Cast :</span>
            <span
              className="text-gray-400 font-medium truncate"
              title={review.cast}
            >
              {review.cast}
            </span>
          </div>

          {/* Optional: Show Release Date only if available */}
          {review.year && (
            <div className="flex">
              <span className="text-gray-500 font-bold w-14">Released :</span>
              <span className="text-gray-400 font-medium">{review.year}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamingReviewCard;
